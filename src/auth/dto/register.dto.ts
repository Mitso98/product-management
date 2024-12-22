import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeEmail } from 'src/common/utils/email.utils';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  @Matches(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    {
      message: 'Invalid email format',
    },
  )
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password - minimum 8 characters',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
