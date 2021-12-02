import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handles a signup request', () => {
    const email = 'asdlkq4321@akl.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'alskdfjl' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('should signup as new user then get the currently log in user', async () => {
    const email = 'asdlkq4321@akl.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'alskdfjl' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        const { email } = res.body;
        expect(email).toEqual(email);
      });
  });
});
