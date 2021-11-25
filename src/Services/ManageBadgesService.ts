import Repositories from "../Repositories";
import { BadgeData } from "../Repositories/Badges/BadgesRepositoryInterface";
import { getBadgesData } from "../Utils/GetAccValue";

export default class ManageBadgesService {
  async addNewBadge(badge: string): Promise<string> {
    const badges = await getBadgesData();
    console.log(badges[badge]);
    const badgeData: BadgeData = {
      name: badges[badge].code,
      expirationDate: badges[badge].expires_at,
    };
    const badgeName = await Repositories.BadgesRepository.addBadge(badgeData);

    return badgeName;
  }
}
