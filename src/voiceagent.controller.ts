import { Controller, Get } from '@nestjs/common';
import { VoiceAgentService } from './voiceagent.service';

@Controller('vapi')
export class VoiceAgentController {
  constructor(private readonly voiceAgentService: VoiceAgentService) {}

  @Get('calls-today')
  async getCallsToday(): Promise<any> {
    return this.voiceAgentService.getCallsToday();
  }
  @Get('transcript')
  async getTranscript(): Promise<any> {
    return this.voiceAgentService.saveTodaysCalls();
  }
}
