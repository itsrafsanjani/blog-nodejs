import { randomBytes } from "crypto";
import EnvValue from "../helpers/EnvValue";

EnvValue.set("APP_KEY", randomBytes(64).toString("hex"));

console.log(`APP_KEY Generated and .env Updated`);
