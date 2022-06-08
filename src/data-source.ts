import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import "dotenv/config"
import { Photo } from "./entity/Photo";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Photo],
    migrations: [],
    subscribers: [],
})
