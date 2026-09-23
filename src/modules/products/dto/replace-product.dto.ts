import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ReplaceProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}