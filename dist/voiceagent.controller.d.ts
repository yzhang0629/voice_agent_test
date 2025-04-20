import { VoiceAgentService } from './voiceagent.service';
export declare class VoiceAgentController {
    private readonly voiceAgentService;
    constructor(voiceAgentService: VoiceAgentService);
    getCallsToday(): Promise<any>;
    getTranscript(): Promise<any>;
}
