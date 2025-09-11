import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateCountries implements MigrationInterface {
  name = 'populate-countries-1755385712482';

  public async up(queryRunner: QueryRunner): Promise<void> {
	// code goes here
  await queryRunner.query(
      `INSERT INTO country (name, code, alpha_code, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), alpha_code = VALUES(alpha_code), updated_at = NOW()`,
      ['Colombia', 'CO', 'COL'],
    );

    const [country] = await queryRunner.query(
      `SELECT id FROM country WHERE code = ?`,
      ['CO'],
    );
    const countryId = country?.id;

    // 2) Regions
    await queryRunner.query(
      `INSERT INTO region (name, code, country_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), country_id = VALUES(country_id), updated_at = NOW()`,
      ['Antioquia', 'ANT', countryId],
    );
    await queryRunner.query(
      `INSERT INTO region (name, code, country_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), country_id = VALUES(country_id), updated_at = NOW()`,
      ['Cundinamarca', 'CUN', countryId],
    );

    const [ant] = await queryRunner.query(
      `SELECT id FROM region WHERE code = ? LIMIT 1`,
      ['ANT'],
    );
    const [cun] = await queryRunner.query(
      `SELECT id FROM region WHERE code = ? LIMIT 1`,
      ['CUN'],
    );
    const antioquiaId = ant?.id;
    const cundinamarcaId = cun?.id;

    // 3) Cities
    await queryRunner.query(
      `INSERT INTO city (name, code, region_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), region_id = VALUES(region_id), updated_at = NOW()`,
      ['Medellín', 'MED', antioquiaId],
    );
    await queryRunner.query(
      `INSERT INTO city (name, code, region_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), region_id = VALUES(region_id), updated_at = NOW()`,
      ['Bogotá', 'BOG', cundinamarcaId],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
	// code goes here
  // Remove cities
    await queryRunner.query(`DELETE FROM city WHERE code IN (?, ?)`, ['MED', 'BOG']);

    // Remove regions
    await queryRunner.query(`DELETE FROM region WHERE code IN (?, ?)`, ['ANT', 'CUN']);

    // Remove country
    await queryRunner.query(`DELETE FROM country WHERE code = ?`, ['CO']);
  }
}