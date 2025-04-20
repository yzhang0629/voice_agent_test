import { HttpException, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { ConfigService } from "@nestjs/config";
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
    await this.pool.query('SELECT 1')
    console.log('MySQL pool created successfully');
  }
  async onModuleDestroy() {
    await this.pool.end();
    console.log('MySQL pool destroyed successfully');
  }
  async getCallsToday() : Promise<any> {
    try {
      const result = await this.client.calls.list({
        createdAtGe : new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
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
        INSERT INTO voice_agent (name, phone_number, transcript) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name), 
          transcript = VALUES(transcript)
      `;
      for (const call of calls) {
        if (!call.analysis.structuredData) continue;
        console.log(call.analysis);
      }
    } catch (error) {
      throw new HttpException(
        `VAPI API request failed: ${error.message}`,
        error.response?.status || 500,
      );
    }
  }
}
