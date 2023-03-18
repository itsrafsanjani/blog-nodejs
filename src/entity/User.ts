import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsDateString,
  IsDefined,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";
import { IsUniq } from "../validation/IsUniq";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsUniq()
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  @IsDateString()
  @IsOptional()
  emailVerifiedAt!: Date;

  @Column({
    nullable: true,
    select: false,
  })
  @IsOptional()
  otp!: number;

  @Column({ select: false })
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
