import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './repository/users.repository';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

@Module({
  imports: [UsersModule],  // UsersModule을 다른 모듈에 포함
})
export class OtherModule {}