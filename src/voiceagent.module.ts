import { Module } from '@nestjs/common';
import { AppController } from './voiceagent.controller';
import { AppService } from './voiceagent.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
