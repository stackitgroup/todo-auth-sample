import { IsString, MaxLength, MinLength } from "class-validator";

export class AccessDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string
}