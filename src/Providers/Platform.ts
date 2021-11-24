import axios from "axios";
import moment, { lang } from "moment";
import Twit from "twit";
import constants from "../Constants/Twitter";
import BadgesRepositoryInterface from "../Repositories/Badges/BadgesRepositoryInterface";

export default class FlowProvider {
  private link = (profileName: string) =>
    `https://flow3r-api-master-2eqj3fl3la-ue.a.run.app/v2/user/badges/${profileName}`;

  private trustedProfiles: string[] = [
    "veiguiz",
    "monark",
    "dekaibr",
    "gui_aguiar_",
    "dimi_",
  ];

  private getValidProfileBadges = async (profileName: string) => {
    try {
      const response = await axios.get(this.link(profileName));
      const now = moment();
      const validProfileBadges = [];
      response.data.badges.forEach((badge) => {
        const expireDate = moment(badge.expires_at);
        const diference = moment.duration(now.diff(expireDate));
        const diffInHours = Number(diference.asHours().toFixed(2));

        if (diffInHours < 0) {
          validProfileBadges.push(badge.code);
        }
      });
      return validProfileBadges;
    } catch (err) {
      console.log(err.data);
    }
  };

  public getBadgesFromProfiles = async () => {
    console.log(`Buscando badges na plataforma do Flow!`);
    const badges = [];

    for (const account of this.trustedProfiles) {
      const valid = await this.getValidProfileBadges(account);
      for (const badge of valid) {
        const lowerBadge = String(badge).toLowerCase();
        if (!badges.includes(lowerBadge)) badges.push(lowerBadge);
      }
    }
    return badges;
  };
}
