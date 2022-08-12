import { randomBytes } from "crypto";
import EnvValue from "../helpers/EnvValue";

EnvValue.set("JWT_SECRET", randomBytes(64).toString("base64"));

console.log(`JWT_SECRET Generated and .env Updated`);
