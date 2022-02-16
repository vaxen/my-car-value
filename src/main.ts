/* istanbul ignore file */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`config path: ./config/${process.env.NODE_ENV}.env`);
  console.log(`swagger at http://localhost:3000/api/`);

  //SWAGGER CONFIG
  const config = new DocumentBuilder()
    .setTitle('Car Value Service')
    .setDescription('The car value API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
