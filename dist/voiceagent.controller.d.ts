import { VoiceAgentService } from './voiceagent.service';
export declare class VoiceAgentController {
    private readonly voiceAgentService;
    constructor(voiceAgentService: VoiceAgentService);
    getCallsToday(): Promise<any>;
    saveTodaysCalls(): Promise<any>;
    cronSaveCallsToday(): Promise<any>;
    saveCallsInRange(startDaysAgo: number, endDaysAgo: number): Promise<any>;
}
