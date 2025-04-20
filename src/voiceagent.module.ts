import { Module } from '@nestjs/common';
import { VoiceAgentController } from './voiceagent.controller';
import { VoiceAgentService } from './voiceagent.service';

@Module({
  imports: [],
  controllers: [VoiceAgentController],
  providers: [VoiceAgentService],
})
export class AppModule {}
