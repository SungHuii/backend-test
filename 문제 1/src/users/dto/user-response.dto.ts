import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Transform(({ value }) => {
        // 이메일 주소를 추출하는 정규식
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const match = value.match(emailRegex);
        return match ? match[0] : value;
    })
    email: string;

    @Expose()
    createdAt: Date;

    @Exclude()
    password: string;
}
