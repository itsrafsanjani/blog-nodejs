import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  MaxLength,
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
  @IsUnique()
  email: string;

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
