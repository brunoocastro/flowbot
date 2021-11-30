import axios from "axios";
import moment from "moment";
import platformConstants from "../Constants/Platform";
import Repositories from "../Repositories";
import getMomentString from "../Utils/DateHelper";

export default class FlowProvider {
  private getValidProfileBadges = async (email: string, token: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(platformConstants.link(email), config);
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
      console.log(
        `${getMomentString()} - Emblemas válidos encontrados na conta ${email}: ${validProfileBadges}`
      );
      return validProfileBadges;
    } catch (err) {
      console.log(
        `${getMomentString()} - Erro ao pegar emblemas válidos pra conta ${email}. Erro: ${err}`
      );
    }
  };

  public getBadgesFromProfiles = async () => {
    console.log(
      `${getMomentString()} - Buscando badges na plataforma do Flow!`
    );
    const allBadges = await Repositories.BadgesRepository.getAllBadges();
    const expiredBadges = [];
    const newBadges = [];

    allBadges.forEach((badge) => expiredBadges.push(badge.name));

    const accounts = await Repositories.AccountsRepository.getAll();

    for (const account of accounts) {
      await account.verifyTokenValidation();
      const valid = await this.getValidProfileBadges(
        account.email,
        account.accessToken
      );
      if (valid?.length > 0)
        for (const badge of valid) {
          const lowerBadge = String(badge).toLowerCase();
          if (
            lowerBadge &&
            !newBadges.includes(lowerBadge) &&
            !expiredBadges.includes(lowerBadge)
          )
            newBadges.push(lowerBadge);
        }
    }
    return newBadges;
  };
}
