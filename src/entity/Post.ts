import {
  IsDateString,
  IsDefined,
  IsMimeType,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @Column("text")
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  description: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  thumbnail: string;

  @Column("int", { default: 0 })
  views: number;

  @Column("datetime")
  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  publishedAt: Date;
}
