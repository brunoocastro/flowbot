import moment from "moment";
import Repositories from "../Repositories";
import { BadgeData } from "../Repositories/Badges/BadgesRepositoryInterface";
import { getBadgesData } from "../Utils/GetAccValue";

export default class ManageBadgesService {
  async addNewBadge(badge: string): Promise<string> {
    try {
      const badgeData: BadgeData = {
        name: badge,
        expirationDate: moment().add(24, "hours").toDate(),
      };
      const badgeName = await Repositories.BadgesRepository.addBadge(badgeData);

      return badgeName;
    } catch (error) {
      console.log("Erro:", error);
    }
    // const badges = await getBadgesData();
    // console.log("Badges", badges[badge]);
  }
}
