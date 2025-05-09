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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceAgentController = void 0;
const common_1 = require("@nestjs/common");
const voiceagent_service_1 = require("./voiceagent.service");
let VoiceAgentController = class VoiceAgentController {
    voiceAgentService;
    constructor(voiceAgentService) {
        this.voiceAgentService = voiceAgentService;
    }
    async getCallsToday() {
        return this.voiceAgentService.getCallsToday();
    }
    async createCall(phone_number) {
        return this.voiceAgentService.callUser(phone_number);
    }
    async saveTodaysCalls() {
        return this.voiceAgentService.saveTodaysCalls();
    }
    async cronSaveCallsToday() {
        return this.voiceAgentService.cronSaveCallsToday();
    }
    async saveCallsInRange(startDaysAgo, endDaysAgo) {
        return this.voiceAgentService.saveCallsInRange(startDaysAgo, endDaysAgo);
    }
};
exports.VoiceAgentController = VoiceAgentController;
__decorate([
    (0, common_1.Get)('calls-today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceAgentController.prototype, "getCallsToday", null);
__decorate([
    (0, common_1.Post)('create-call'),
    __param(0, (0, common_1.Query)('phone_number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VoiceAgentController.prototype, "createCall", null);
__decorate([
    (0, common_1.Post)('saveCallsToday'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceAgentController.prototype, "saveTodaysCalls", null);
__decorate([
    (0, common_1.Post)('cronSaveCallsToday'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceAgentController.prototype, "cronSaveCallsToday", null);
__decorate([
    (0, common_1.Post)('saveCallsDateRange'),
    __param(0, (0, common_1.Query)('startDaysAgo')),
    __param(1, (0, common_1.Query)('endDaysAgo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], VoiceAgentController.prototype, "saveCallsInRange", null);
exports.VoiceAgentController = VoiceAgentController = __decorate([
    (0, common_1.Controller)('vapi'),
    __metadata("design:paramtypes", [voiceagent_service_1.VoiceAgentService])
], VoiceAgentController);
//# sourceMappingURL=voiceagent.controller.js.map