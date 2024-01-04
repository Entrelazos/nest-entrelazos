// uniqueness-validation.util.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class UniquenessValidationUtil {
  constructor(private readonly entityManager: EntityManager) {}

  async validateUniqueness(
    entityName: string,
    column: string,
    value: any,
  ): Promise<boolean> {
    const repository = this.entityManager.getRepository(entityName);
    const existingEntity = await repository.findOne({
      where: { [column]: value },
    });
    return !!existingEntity;
  }
}
