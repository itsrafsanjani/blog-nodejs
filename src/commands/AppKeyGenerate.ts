import { randomBytes } from "crypto";
import EnvValue from "../helpers/EnvValue";

EnvValue.set("APP_KEY", randomBytes(64).toString("base64"));

console.log(`APP_KEY Generated and .env Updated`);
