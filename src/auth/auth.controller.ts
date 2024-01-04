import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/services/user.service';
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
    try {
      const user = await this.authService.register(createUserDto);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDTO) {
    try {
      const user = await this.authService.login(loginUserDto);
      const { email, refreshToken } = user;
      await this.authService.updateRefreshToken(email, refreshToken);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() tokenDto: TokenDTO) {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
