export type EntityType = 'product' | 'user' | 'company';
export enum EntityTypeEnum {
  Product = 'product',
  User = 'user',
  Company = 'company',
}
export const ENTITY_TYPES = [
  EntityTypeEnum.Product,
  EntityTypeEnum.User,
  EntityTypeEnum.Company,
];
