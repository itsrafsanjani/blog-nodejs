import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsDefined, IsInt, Length } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
