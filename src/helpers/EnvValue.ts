import { readFileSync, writeFileSync } from "fs";
import { EOL } from "os";

export class EnvValue {
  set = (key: string, value: string) => {
    // read file from file storage & split if from a line break to a array
    const ENV_VARS = readFileSync("./.env", "utf8").split(EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(
      ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
      })
    );

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    writeFileSync("./.env", ENV_VARS.join(EOL));
  };
}

export default new EnvValue();
