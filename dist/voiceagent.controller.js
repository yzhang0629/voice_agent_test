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
    async getTranscript() {
        return this.voiceAgentService.saveTodaysCalls();
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
    (0, common_1.Get)('transcript'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceAgentController.prototype, "getTranscript", null);
exports.VoiceAgentController = VoiceAgentController = __decorate([
    (0, common_1.Controller)('vapi'),
    __metadata("design:paramtypes", [voiceagent_service_1.VoiceAgentService])
], VoiceAgentController);
//# sourceMappingURL=voiceagent.controller.js.map