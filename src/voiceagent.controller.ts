import { Controller, Get, Post, Query } from '@nestjs/common';
import { VoiceAgentService } from './voiceagent.service';

@Controller('vapi')
export class VoiceAgentController {
  constructor(private readonly voiceAgentService: VoiceAgentService) {}

  @Get('calls-today')
  async getCallsToday(): Promise<any> {
    return this.voiceAgentService.getCallsToday();
  }
  @Post('saveCallsToday')
  async saveTodaysCalls(): Promise<any> {
    return this.voiceAgentService.saveTodaysCalls();
  }
  @Post('cronSaveCallsToday')
  async cronSaveCallsToday(): Promise<any> {
    return this.voiceAgentService.cronSaveCallsToday();
  }
  @Post('saveCallsDateRange')
  async saveCallsInRange(
    @Query('startDaysAgo') startDaysAgo: number,
    @Query('endDaysAgo') endDaysAgo: number,
  ): Promise<any> {
    return this.voiceAgentService.saveCallsInRange(startDaysAgo, endDaysAgo);
  }
}
