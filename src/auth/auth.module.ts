import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from 'src/user/entities/role.entity';
import { City } from 'src/common/entities/city.entity';
import { UtilsModule } from 'src/util/utils.module';
import { Social } from 'src/common/entities/social.entity';
import { RolesGuard } from 'src/guards/roles/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, City, Social]),
    UtilsModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '15d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
