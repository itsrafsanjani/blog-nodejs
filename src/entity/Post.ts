import {
  IsDateString,
  IsDefined,
  IsMimeType,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column({
    length: 255,
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @Column({
    unique: true,
    length: 255,
  })
  @MinLength(3)
  @MaxLength(255)
  slug: string;

  @Column({
    length: 255,
  })
  excerpt: string;

  @Column("text")
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(5000)
  description: string;

  @Column()
  @IsDefined()
  @IsNotEmpty()
  thumbnail: string;

  @Column({ type: "simple-array" })
  @IsDefined()
  @IsNotEmpty()
  tags: string[];

  @Column("int", { default: 0 })
  views: number;

  @Column("datetime")
  @IsDefined()
  @IsNotEmpty()
  @IsDateString()
  publishedAt: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
