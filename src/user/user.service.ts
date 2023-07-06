import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDTO) {
    return { ...createUserDto, id: 'Here' };
  }
}
