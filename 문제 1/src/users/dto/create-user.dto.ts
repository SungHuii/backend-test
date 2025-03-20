import { IsString, IsEmail, MinLength, MaxLength, Matches, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, { message: '비밀번호는 영문자와 숫자를 포함해야 합니다.' })
    password: string;

}