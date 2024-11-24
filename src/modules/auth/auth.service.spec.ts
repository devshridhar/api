import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

// Mock bcrypt globally
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let mockUserModel: any;

  beforeEach(async () => {
    // Proper mock for userModel
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(), // Mock the sign function
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {

    it('should throw an error if the user already exists', async () => {
      const signupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      // Mock findOne to return a user
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(signupDto),
        }),
      });

      await expect(authService.signup(signupDto)).rejects.toThrow(
        'User with email test@example.com already exists',
      );
    });
  });

  describe('signin', () => {
    it('should return a JWT token for valid credentials', async () => {
      const signinDto = { email: 'test@example.com', password: 'Password123!' };
      const user = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };
      const token = 'mockToken';

      // Mock findOne to return a user
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(user),
        }),
      });
      // Mock bcrypt compare
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      // Mock JWT sign
      (jwtService.sign as jest.Mock).mockReturnValueOnce(token);

      const result = await authService.signin(signinDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: signinDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(signinDto.password, user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user._id,
        email: user.email,
      });
      expect(result).toEqual({
        message: 'Sign-in successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    });

    it('should throw an error for invalid credentials', async () => {
      const signinDto = { email: 'test@example.com', password: 'WrongPassword' };
      const user = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };

      // Mock findOne to return a user
      mockUserModel.findOne.mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(user),
        }),
      });
      // Mock bcrypt compare to return false
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.signin(signinDto)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });
});
