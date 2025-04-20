export declare class VoiceAgentService {
    private readonly vapi_api_key;
    private readonly assistant_id;
    private readonly phone_number_id;
    private client;
    constructor();
    getCallsToday(): Promise<any>;
}
