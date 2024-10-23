export type EntityType = 'product' | 'user' | 'company';

export type ImageType =
  | ImageTypeEnum.UserProfile
  | ImageTypeEnum.CompanyProfile
  | ImageTypeEnum.CompanyBanner
  | ImageTypeEnum.ProductImage;

export enum EntityTypeEnum {
  Product = 'product',
  User = 'user',
  Company = 'company',
}

export enum ImageTypeEnum {
  UserProfile = 'user_profile',
  CompanyProfile = 'company_profile',
  CompanyBanner = 'company_banner',
  ProductImage = 'product_image',
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
  ImageTypeEnum.ProductImage,
];
