import { HttpException, Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { VapiClient } from "@vapi-ai/server-sdk";

config();
@Injectable()
export class VoiceAgentService {
  private readonly vapi_api_key = process.env.VAPI_API_KEY;
  private readonly assistant_id = process.env.VAPI_ASSISTANT_ID;
  private readonly phone_number_id = process.env.VAPI_PHONE_NUMBER_ID;
  private client : VapiClient;
  constructor() {
    if (!this.vapi_api_key) throw new Error('VAPI_API_KEY is not set');
    this.client = new VapiClient({token : this.vapi_api_key});
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
}
