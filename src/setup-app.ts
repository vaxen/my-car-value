import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
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
};
