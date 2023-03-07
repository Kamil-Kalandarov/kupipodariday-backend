import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
