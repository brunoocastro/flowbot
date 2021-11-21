import BadgesRepositoryInterface from "./BadgesRepositoryInterface";

export default class BadgesMemoryRepository
  implements BadgesRepositoryInterface
{
  private badges = [];

  async addBadge(badge: string) {
    this.badges.push(badge);
    return badge;
  }

  async getUsedBadges() {
    return this.badges;
  }
}
