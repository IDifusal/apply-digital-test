import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'test123' })
  @IsString()
  @MinLength(6)
  password!: string;
}
