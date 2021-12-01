import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const cookieSession = require('cookie-session');
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //SWAGGER CONFIG
  const config = new DocumentBuilder()
    .setTitle('Car Value Service')
    .setDescription('The car value API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  //Cookies
  app.use(
    cookieSession({
      //key use to encrypt the cookie
      keys: ['asfasgasgasg'],
    }),
  );
  //VALIDATIONS
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();
