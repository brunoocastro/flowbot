export default interface BadgesRepositoryInterface {
  getUsedBadges(): Promise<string[]>;
  addBadge(badge: string): Promise<string>;
}
