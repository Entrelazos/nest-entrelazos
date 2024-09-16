export type EntityType = 'product' | 'user' | 'company';
export type ImageType = 'user_profile' | 'company_profile' | 'company_banner';
export enum EntityTypeEnum {
  Product = 'product',
  User = 'user',
  Company = 'company',
}
export enum ImageTypeEnum {
  UserProfile = 'user_profile',
  CompanyProfile = 'company_profile',
  CompanyBanner = 'company_banner',
}
export const ENTITY_TYPES = [
  EntityTypeEnum.Product,
  EntityTypeEnum.User,
  EntityTypeEnum.Company,
];

export const IMAGE_TYPES = [
  ImageTypeEnum.UserProfile,
  ImageTypeEnum.CompanyProfile,
  ImageTypeEnum.CompanyBanner,
];
