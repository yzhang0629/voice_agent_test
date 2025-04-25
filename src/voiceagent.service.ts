import { HttpException, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { Cron } from '@nestjs/schedule';
import { VapiClient } from "@vapi-ai/server-sdk";
import { createPool, Pool } from "mysql2/promise";

config();
@Injectable()
export class VoiceAgentService {
  private readonly vapi_api_key = process.env.VAPI_API_KEY;
  private readonly assistant_id = process.env.VAPI_ASSISTANT_ID;
  private readonly phone_number_id = process.env.VAPI_PHONE_NUMBER_ID;

  private readonly db_host = process.env.DB_HOST;
  private readonly db_username = process.env.DB_USERNAME;
  private readonly db_password = process.env.DB_PASSWORD;
  private readonly db_database = process.env.DB_DATABASE;
  private readonly db_port = process.env.DB_PORT;
  

  private client : VapiClient;
  private pool: Pool;
  constructor() {
    if (!this.vapi_api_key) throw new Error('VAPI_API_KEY is not set');
    this.client = new VapiClient({token : this.vapi_api_key});
  }
  async onModuleInit() {
    this.pool = createPool({
      host: this.db_host || '',
      user: this.db_username || '',
      password: this.db_password || '',
      database: this.db_database || '',
      port: Number(this.db_port),
      connectionLimit: 10
    });
  }
  async onModuleDestroy() {
    await this.pool.end();
    console.log('MySQL pool destroyed successfully');
  }
  @Cron('59 23 * * *')
  async cronSaveCallsToday() {
    await this.saveTodaysCalls();
  }
  async getCallsToday() : Promise<any> {
    try {
      const result = await this.client.calls.list({
        createdAtGe : new Date(new Date().setHours(0, -1, 0, 0)).toISOString()
      });
      return result;
    } catch (error) {
      throw new HttpException(
        `VAPI API request failed: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
  async getCallsInRange(startDaysAgo: number, endDaysAgo: number): Promise<any> {
    try {
      const startDate = new Date(new Date().setHours(0, -1, 0, 0));
      startDate.setDate(startDate.getDate() - startDaysAgo);
      const endDate = new Date(new Date().setHours(0, -1, 0, 0));
      endDate.setDate(endDate.getDate() - endDaysAgo);
        const result = await this.client.calls.list({
        createdAtGe: startDate.toISOString(),
        createdAtLe: endDate.toISOString(),
      });
      return result;
    } catch (error) {
      throw new HttpException(
        `VAPI API request failed: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
  async saveTodaysCalls() : Promise<any> {
    try {
      const calls = await this.getCallsToday();
      const sql = `
        INSERT INTO voice_agent (name, phone_number, transcript, call_start_time, event, summary) 
        VALUES (?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name), 
          transcript = VALUES(transcript)
      `;
      for (const call of calls) {
        if (!call.analysis.structuredData 
          || !call.analysis.structuredData.event 
          || !call.analysis.structuredData.name 
          || !call.customer) continue;     
        const mysqlDatetime = new Date(call.startedAt).toISOString().slice(0, 19).replace('T', ' ');
        console.log(mysqlDatetime);   
        await this.pool.query(sql, [
          call.analysis.structuredData.name,
          call.customer.number,
          call.transcript,
          mysqlDatetime,
          call.analysis.structuredData.event,
          call.analysis.summary
        ]);
      }
    } catch (error) {
      throw new HttpException(
        `VAPI API request failed: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
  async saveCallsInRange(startDaysAgo: number, endDaysAgo: number): Promise<any> {
    try {
      const calls = await this.getCallsInRange(startDaysAgo, endDaysAgo);
      const sql = `
        INSERT INTO voice_agent (name, phone_number, transcript) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name), 
          transcript = VALUES(transcript)
      `;
      for (const call of calls) {
        if (!call.analysis.structuredData || !call.customer) continue;
        await this.pool.query(sql, [
          call.analysis.structuredData.name,
          call.customer.number,
          call.analysis.summary,
        ]);
      }
    } catch (error) {
      throw new HttpException(
        `VAPI API request failed: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
}
