import axios from "axios";
import moment, { Moment } from "moment";

export default class Account {
  email: string;
  username: string;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiration: Moment = moment();
  badges: string[] = [];

  constructor(email: string, username: string, refreshToken: string) {
    this.email = email;
    this.username = username;
    this.refreshToken = refreshToken;
  }

  verifyTokenValidation(): Promise<void> {
    const expired = this.accessTokenExpiration < moment();
    if (expired) this.updateAccessToken();
    return;
  }

  alreadyHaveBadge(badge: string) {
    const res = this.badges.includes(badge);
    if (res)
      console.log(`O usuário ${this.username} já possui o emblema ${badge}`);
    return res;
  }

  async updateAccessToken() {
    const link =
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyDXtoJRAEQCZL3nzNDToCHTtoBn2Y-g6jY";
    const data = {
      grant_type: "refresh_token",
      refresh_token: this.refreshToken,
    };

    const config = {
      headers: {
        referer: "https://flowpodcast.com.br/",
      },
    };

    try {
      const request = await axios.post(link, data, config);
      this.accessToken = request.data.access_token;
      this.accessTokenExpiration = moment().add(
        request.data.expires_in,
        "seconds"
      );
      console.log(
        `O accessToken do ${this.username} foi atualizado com sucesso!`
      );
    } catch (e) {
      console.log(`Erro ao pegar o accessToken de ${this.username}: ${e}`);
    }
  }

  async pickBadge(badgeName: string): Promise<void> {
    if (this.alreadyHaveBadge(badgeName)) return;
    if (!this.verifyTokenValidation()) await this.updateAccessToken();

    const link =
      "https://flow3r-api-master-2eqj3fl3la-ue.a.run.app//v2/badges/redeem";

    const config = {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    };

    const data = {
      email: this.email,
      code: badgeName,
    };

    try {
      const request = await axios.post(link, data, config);
      if (request.status === 200) {
        console.log(request.data);
        console.log(
          `Emblema ${badgeName} resgatado com sucesso para ${this.username}`
        );
        this.badges.push(request.data);
      }
      console.log(request.data.response.data);
    } catch (e) {
      console.log(
        `Erro ao pegar emblema ${badgeName} para ${this.username}`,
        e.response.data
      );
    }
    return;
  }
}
