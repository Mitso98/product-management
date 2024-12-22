import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { normalizeEmail } from '../common/utils/email.utils';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.initSuperAdmin();
  }

  private async initSuperAdmin() {
    // Check if super admin exists
    const adminExists = await this.findByEmail(
      this.configService.get<string>('SUPER_ADMIN_EMAIL'),
    );

    if (!adminExists) {
      await this.usersRepository.save({
        email: this.configService.get<string>('SUPER_ADMIN_EMAIL'),
        password: await bcrypt.hash(
          this.configService.get<string>('SUPER_ADMIN_PASSWORD'),
          10,
        ),
        role: UserRole.ADMIN,
      });
    }
    this.logger.debug('Super admin created', 'UsersService');
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const normalizedEmail = normalizeEmail(registerDto.email);
    const existingUser = await this.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      ...registerDto,
      email: normalizedEmail,
      role: UserRole.USER, // Force all registrations to be regular users
    });

    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    const normalizedEmail = normalizeEmail(email);
    return this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });
  }
}
