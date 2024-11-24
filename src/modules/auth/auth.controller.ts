import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        id: '67439af480c7dfe81ef73716',
        email: 'test@exampddddle.com',
        name: 'Test User',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Email already exists.',
    schema: {
      example: {
        statusCode: 409,
        message: 'User with email test@exampddddle.com already exists',
        timestamp: '2024-11-24T21:30:52.988Z',
        path: '/auth/signup',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Validation failed for input.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Please provide a valid email address',
          'Name can only contain letters and spaces',
          'Name must be at least 3 characters long',
          'Name is required',
          'Password must contain at least one number',
          'Password must be longer than or equal to 8 characters',
        ],
        timestamp: '2024-11-24T21:31:29.511Z',
        path: '/auth/signup',
      },
    },
  })
  @ApiBody({ type: SignupDto })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'Sign-in successful',
    schema: {
      example: {
        message: 'Sign-in successful',
        user: {
          id: '67436219f19d1234c03aa4ba',
          email: 'testuser@example.com',
          name: 'Test User',
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDM2MjE5ZjE5ZDEyMzRjMDNhYTRiYSIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzI0ODUwNzksImV4cCI6MTczMjQ4ODY3OX0.k2EmXTcF_nGuPmKZFDmedpAJSgPH9befT0TMn_bRtzo',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid email or password.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        timestamp: '2024-11-24T21:14:21.131Z',
        path: '/auth/signin',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Validation failed for input.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Please provide a valid email address',
          'password should not be empty',
        ],
        timestamp: '2024-11-24T21:53:21.576Z',
        path: '/auth/signin',
      },
    },
  })
  @ApiBody({ type: SigninDto })
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
}
