import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}
  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      this.logger.error('Registration failed', error.stack);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await user.validatePassword(loginDto.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_PRIVATE_KEY'),
        algorithm: 'RS256',
        expiresIn: '1d',
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      this.logger.error('Login failed', error.stack);
      throw error;
    }
  }
}
