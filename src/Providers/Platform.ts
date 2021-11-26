import axios from "axios";
import moment, { lang } from "moment";
import Twit from "twit";
import twitterConstants from "../Constants/Twitter";
import platformConstants from "../Constants/Platform";
import BadgesRepositoryInterface from "../Repositories/Badges/BadgesRepositoryInterface";
import getMomentString from "../Utils/DateHelper";

export default class FlowProvider {
  private getValidProfileBadges = async (profileName: string) => {
    try {
      const response = await axios.get(platformConstants.link(profileName));
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
    console.log(
      `${getMomentString()} - Buscando badges na plataforma do Flow!`
    );
    const badges = [];

    for (const account of platformConstants.trustedProfiles) {
      const valid = await this.getValidProfileBadges(account);
      if (valid?.length > 0)
        for (const badge of valid) {
          const lowerBadge = String(badge).toLowerCase();
          if (!badges.includes(lowerBadge)) badges.push(lowerBadge);
        }
    }
    return badges;
  };
}
