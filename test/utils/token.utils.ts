import { JwtService } from '@nestjs/jwt';

export function generateUserToken(id: string): string {
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });

  return jwtService.sign({ id }, { secret: process.env.JWT_SECRET });
}
