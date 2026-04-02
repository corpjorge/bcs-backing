import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserApiService } from '../routes/user-api/user-api.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userApiService: UserApiService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(data: {
    documentType: string;
    documentNumber: number;
    password: string;
  }): Promise<{ access_token: string }> {
    const user = await this.userApiService.readUserData(data);

    if (!user || typeof user !== 'object' || 'statusCode' in user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: data.documentNumber,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      username: (user as { username?: string }).username,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
