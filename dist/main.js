"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const voiceagent_module_1 = require("./voiceagent.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(voiceagent_module_1.AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map