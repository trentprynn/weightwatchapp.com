import { RequestMethod, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('v1', {
    exclude: [
      { path: '', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  })

  app.use(helmet())

  app.enableCors({
    origin: ['http://localhost:4200', 'https://weightwatchapp.com'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Weight Watch API')
    .setDescription('The weight watch API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'WeightWatch API Docs',
  })

  await app.listen(AppModule.port || 3000)
}
bootstrap()
