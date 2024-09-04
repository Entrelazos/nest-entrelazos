import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
