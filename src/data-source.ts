import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import "dotenv/config"
import { Photo } from "./entity/Photo";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST ?? "localhost",
    port: 3306,
    username: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "blog_nodejs",
    synchronize: true,
    logging: false,
    entities: [User, Photo],
    migrations: [],
    subscribers: [],
})
