import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO, LoginUserDTO } from 'src/user/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

    delete user.password;
    return { ...user, accessToken, refreshToken };
  }

  async updateRefreshToken(email: string, refreshToken: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      user.refreshToken = refreshToken;
      this.userRepository.save(user);
    }
  }
}
