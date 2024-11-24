import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn(),
      signin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and return its result', async () => {
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

      const result = await authController.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(signupResult);
    });

    it('should throw an error if signup fails', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      jest
        .spyOn(authService, 'signup')
        .mockRejectedValueOnce(new Error('Signup failed'));

      await expect(authController.signup(signupDto)).rejects.toThrow(
        'Signup failed',
      );
    });
  });

  describe('signin', () => {
    it('should call authService.signin and return its result', async () => {
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

      const result = await authController.signin(signinDto);

      expect(authService.signin).toHaveBeenCalledWith(signinDto);
      expect(result).toEqual(signinResult);
    });

    it('should throw an error if signin fails', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      jest
        .spyOn(authService, 'signin')
        .mockRejectedValueOnce(new Error('Invalid email or password'));

      await expect(authController.signin(signinDto)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });
});
