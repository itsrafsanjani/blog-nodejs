import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  age: number;
}
