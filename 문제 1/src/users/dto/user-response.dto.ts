import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    @Transform(({ value }) => {
        const regex = /\[([^\]]+)\]\(mailto:([^\)]+)\)/;
        const match = value.match(regex);
        return match ? match[2] : value;
    }, { toClassOnly: true })
    email: string;

    @Expose()
    createdAt: Date;

    @Exclude()
    password: string;
}
