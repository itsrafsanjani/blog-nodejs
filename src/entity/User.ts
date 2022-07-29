import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";
import { IsDefined, IsEmail, IsInt, Length } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsDefined()
  @Length(1, 255)
  firstName: string;

  @Column()
  @IsDefined()
  @Length(1, 255)
  lastName: string;

  @Column()
  @IsDefined()
  @IsInt()
  age: number;
}
