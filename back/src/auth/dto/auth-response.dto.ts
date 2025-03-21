import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticating requests',
    example: 'kjnzdxjnkasdy7893i...'
  })
  access_token: string;
}