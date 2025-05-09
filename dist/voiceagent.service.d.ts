export declare class VoiceAgentService {
    private readonly vapi_api_key;
    private readonly assistant_id;
    private readonly phone_number_id;
    private readonly db_host;
    private readonly db_username;
    private readonly db_password;
    private readonly db_database;
    private readonly db_port;
    private client;
    private pool;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    cronSaveCallsToday(): Promise<void>;
    callUser(phone_number: string): Promise<any>;
    getCallsToday(): Promise<any>;
    getCallsInRange(startDaysAgo: number, endDaysAgo: number): Promise<any>;
    saveTodaysCalls(): Promise<any>;
    saveCallsInRange(startDaysAgo: number, endDaysAgo: number): Promise<any>;
}
