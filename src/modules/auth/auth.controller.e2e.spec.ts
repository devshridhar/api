import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import request from 'supertest'; // Use default import
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { SignupFailedException } from './exceptions/signup-failed.exception';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should return the created user', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };
      const signupResult = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      jest.spyOn(authService, 'signup').mockResolvedValueOnce(signupResult);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(response.body).toEqual(signupResult);
    });

    it('should return an error if signup fails', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      jest
        .spyOn(authService, 'signup')
        .mockRejectedValueOnce(new SignupFailedException('Duplicate entry for email'));

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(500);

      expect(response.body.message).toBe('Signup failed: Duplicate entry for email');
    });
  });

  describe('POST /auth/signin', () => {
    it('should return a JWT token for valid credentials', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const signinResult = {
        message: 'Sign-in successful',
        user: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'mockToken',
      };

      jest.spyOn(authService, 'signin').mockResolvedValueOnce(signinResult);

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinDto)
        .expect(200);

      expect(authService.signin).toHaveBeenCalledWith(signinDto);
      expect(response.body).toEqual(signinResult);
    });

    it('should return an error for invalid credentials', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      jest
        .spyOn(authService, 'signin')
        .mockRejectedValueOnce(new UnauthorizedException('Invalid email or password'));

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
