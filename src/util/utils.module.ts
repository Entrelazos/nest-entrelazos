import { Module } from '@nestjs/common';
import { UniquenessValidationUtil } from './uniqueness-validation.util';

@Module({
  providers: [UniquenessValidationUtil],
  exports: [UniquenessValidationUtil],
})
export class UtilsModule {}
