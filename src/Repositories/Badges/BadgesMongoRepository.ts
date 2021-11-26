import { isValidObjectId } from "mongoose";
import Badge from "../../Schemas/Badge";
import BadgesRepositoryInterface, {
  BadgeData,
} from "./BadgesRepositoryInterface";

export default class BadgesMongoRepository
  implements BadgesRepositoryInterface
{
  private badges = [];

  async addBadge(badge: BadgeData) {
    const badgeExists = await this.isExistentBadge(badge.name);
    if (!badgeExists) await Badge.create(badge);
    // await Badge.updateOne({ name: badge.name }, badge, { upsert: true });
    return badge.name;
  }

  async getAllBadges() {
    return await Badge.find({}).lean();
  }

  async isExistentBadge(badge: string) {
    const badgeExists = await Badge.exists({ name: badge });

    return badgeExists;
  }
}
