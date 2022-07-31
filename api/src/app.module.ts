import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { UserModule } from './user/user.module'
import { WeightLogModule } from './weight-log/weight-log.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    HealthModule,
    WeightLogModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {
  static port?: string | undefined

  constructor(configService: ConfigService) {
    AppModule.port = configService.get('PORT')
  }
}
