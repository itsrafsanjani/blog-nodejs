import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 255,
  })
  title: string;

  @Column("text")
  description: string;

  @Column()
  thumbnail: string;

  @Column("int", { default: 0 })
  views: number;

  @Column("datetime")
  publishedAt: Date;
}
