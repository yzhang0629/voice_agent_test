"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceAgentService = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
const schedule_1 = require("@nestjs/schedule");
const server_sdk_1 = require("@vapi-ai/server-sdk");
const promise_1 = require("mysql2/promise");
(0, dotenv_1.config)();
let VoiceAgentService = class VoiceAgentService {
    vapi_api_key = process.env.VAPI_API_KEY;
    assistant_id = process.env.VAPI_ASSISTANT_ID;
    phone_number_id = process.env.VAPI_PHONE_NUMBER_ID;
    db_host = process.env.DB_HOST;
    db_username = process.env.DB_USERNAME;
    db_password = process.env.DB_PASSWORD;
    db_database = process.env.DB_DATABASE;
    db_port = process.env.DB_PORT;
    client;
    pool;
    constructor() {
        if (!this.vapi_api_key)
            throw new Error('VAPI_API_KEY is not set');
        this.client = new server_sdk_1.VapiClient({ token: this.vapi_api_key });
    }
    async onModuleInit() {
        this.pool = (0, promise_1.createPool)({
            host: this.db_host || '',
            user: this.db_username || '',
            password: this.db_password || '',
            database: this.db_database || '',
            port: Number(this.db_port),
            connectionLimit: 10
        });
    }
    async onModuleDestroy() {
        await this.pool.end();
        console.log('MySQL pool destroyed successfully');
    }
    async cronSaveCallsToday() {
        await this.saveTodaysCalls();
    }
    async getCallsToday() {
        try {
            const result = await this.client.calls.list({
                createdAtGe: new Date(new Date().setHours(0, -1, 0, 0)).toISOString()
            });
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(`VAPI API request failed: ${error.message}`, error.response?.status || 500);
        }
    }
    async getCallsInRange(startDaysAgo, endDaysAgo) {
        try {
            const startDate = new Date(new Date().setHours(0, -1, 0, 0));
            startDate.setDate(startDate.getDate() - startDaysAgo);
            const endDate = new Date(new Date().setHours(0, -1, 0, 0));
            endDate.setDate(endDate.getDate() - endDaysAgo);
            const result = await this.client.calls.list({
                createdAtGe: startDate.toISOString(),
                createdAtLe: endDate.toISOString(),
            });
            return result;
        }
        catch (error) {
            throw new common_1.HttpException(`VAPI API request failed: ${error.message}`, error.response?.status || 500);
        }
    }
    async saveTodaysCalls() {
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
                if (!call.analysis.structuredData || !call.customer)
                    continue;
                await this.pool.query(sql, [
                    call.analysis.structuredData.name,
                    call.customer.number,
                    call.analysis.summary,
                ]);
            }
        }
        catch (error) {
            throw new common_1.HttpException(`VAPI API request failed: ${error.message}`, error.response?.status || 500);
        }
    }
    async saveCallsInRange(startDaysAgo, endDaysAgo) {
        try {
            const calls = await this.getCallsInRange(startDaysAgo, endDaysAgo);
            const sql = `
        INSERT INTO voice_agent (name, phone_number, transcript) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name), 
          transcript = VALUES(transcript)
      `;
            for (const call of calls) {
                if (!call.analysis.structuredData || !call.customer)
                    continue;
                await this.pool.query(sql, [
                    call.analysis.structuredData.name,
                    call.customer.number,
                    call.analysis.summary,
                ]);
            }
        }
        catch (error) {
            throw new common_1.HttpException(`VAPI API request failed: ${error.message}`, error.response?.status || 500);
        }
    }
};
exports.VoiceAgentService = VoiceAgentService;
__decorate([
    (0, schedule_1.Cron)('59 23 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceAgentService.prototype, "cronSaveCallsToday", null);
exports.VoiceAgentService = VoiceAgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VoiceAgentService);
//# sourceMappingURL=voiceagent.service.js.map