export interface BadgeData {
  name: string;
  expirationDate: Date;
}

export default interface BadgesRepositoryInterface {
  getAllBadges(): Promise<BadgeData[]>;
  addBadge(badge: BadgeData): Promise<string>;
  isExistentBadge(badge: string): Promise<boolean>;
}
