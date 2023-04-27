import { MoreThan } from "typeorm";
import { AppDataSource } from "../data-source";
import { PersonalAccessToken } from "../entity/PersonalAccessToken";
import { User } from "../entity/User";
import { generateRandomString } from "../helpers/global";
import { createHash } from "crypto";
import app from "../config/app";

class PersonalAccessTokenService {
  async createToken(user: User, name: string): Promise<PersonalAccessToken> {
    const token = generateRandomString(40);
    const personalAccessToken = new PersonalAccessToken();
    personalAccessToken.user = user;
    personalAccessToken.name = name;
    personalAccessToken.token = this.encryptToken(token);
    personalAccessToken.expiresAt = new Date(
      Date.now() + app.personalAccessTokenExpiresIn
    );

    return await AppDataSource.getRepository(PersonalAccessToken).save(
      personalAccessToken
    );
  }

  async findByToken(token: string): Promise<PersonalAccessToken | undefined> {
    const encryptedToken = this.encryptToken(token);
    const now = new Date();
    return await AppDataSource.getRepository(PersonalAccessToken).findOne({
      where: {
        token: encryptedToken,
        expiresAt: MoreThan(now),
      },
    });
  }

  encryptToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}

export default new PersonalAccessTokenService();
