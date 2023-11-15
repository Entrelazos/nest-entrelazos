import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { TokenDTO } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO) {
    const user = await this.authService.login(loginUserDto);
    return user;
  }

  @Post('refresh-token')
  async refreshToken(@Body() tokenDto: TokenDTO) {
    const { refreshToken } = tokenDto;

    // Check if the refresh token is valid (e.g., exists in the database)
    const user = await this.userService.findByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { email } = user;
    // Generate a new access token
    const payload = { email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    return { accessToken };
  }
}
