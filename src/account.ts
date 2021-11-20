import axios from "axios";
import moment, { Moment } from "moment";

export default class Account {
  email: string;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiration: Moment = moment();
  badges: string[];

  constructor(email: string, refreshToken: string) {
    this.email = email;
    this.refreshToken = refreshToken;
  }

  canDoReq() {
    return this.accessTokenExpiration < moment();
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
    } catch (e) {
      console.log(`Erro ao pegar o accessToken de ${this.email}: ${e}`);
    }
  }

  async getBadge(badgeName: string) {
    if (!this.canDoReq()) await this.updateAccessToken();

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
      if (request.status === 200) this.badges.push(request.data);
      console.log(request.data.response.data);
    } catch (e) {
      // console.log(e);
      console.log(
        `Erro ao pegar emblema ${badgeName} para ${this.email}`,
        e.response.data
      );
    }
  }
}
