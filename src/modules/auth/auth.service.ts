import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignupFailedException } from './exceptions/signup-failed.exception';
import { SignupResponseDto } from './dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<SignupResponseDto> {
    try {
      const { email, name, password } = signupDto;

      // Check if the user already exists
      const existingUser = await this.userModel
        .findOne({ email })
        .lean()
        .exec();
      if (existingUser) {
        throw new UserAlreadyExistsException(email);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({
        email,
        name,
        password: hashedPassword,
      });
      const savedUser = await user.save();

      return {
        id: savedUser._id.toString(),
        email: savedUser.email,
        name: savedUser.name,
      };
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw error; // Let custom exception for existing users propagate
      }

      // Handle MongoDB or other specific errors (Concurrent request Attack)
      if (error.code === 11000) {
        throw new SignupFailedException('Duplicate entry for email');
      }

      // Log the error and throw a generic custom exception
      console.error('Signup Error:', error);
      throw new SignupFailedException(error.message);
    }
  }

  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    const { email, password } = signinDto;

    const user = await this.userModel.findOne({ email }).lean().exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Sign-in successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}
