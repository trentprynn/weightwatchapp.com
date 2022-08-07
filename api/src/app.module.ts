import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ActivityModule } from './activity/activity.module'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { WeightModule } from './weight-log/weight.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    WeightModule,
    ActivityModule,
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
