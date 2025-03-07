import { Type } from "class-transformer";
import { IsDate, IsString, MaxLength, MinDate, MinLength } from "class-validator";

export class CreateTodoDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    title: string

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    description: string

    @IsDate()
    @Type(() => Date)
    @MinDate(new Date(), {message: 'The due date must be in the future'})
    dueDate: Date
}