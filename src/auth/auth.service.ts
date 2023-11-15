import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, LoginUserDTO } from 'src/user/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDTO) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }

  async login(loginUserDto: LoginUserDTO) {
    const { email, password } = loginUserDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = uuidv4();

    // Store the refresh token in the database
    await this.userService.updateRefreshToken(email, refreshToken);

    return { accessToken, refreshToken };
  }
}
