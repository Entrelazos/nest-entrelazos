const fs = require('fs');

const timestamp = Date.now();
const dt = new Date();
const args = process.argv.splice(2);
const className = args[0] || 'NoClassNameGiven';
const migrationName = args[1] || 'no-name-specified';

const dateStr = `${dt.getFullYear().toString().padStart(4, '0')}-${(
  dt.getMonth() + 1
)
  .toString()
  .padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}-${dt
  .getHours()
  .toString()
  .padStart(2, '0')}-${dt.getMinutes().toString().padStart(2, '0')}-${dt
  .getSeconds()
  .toString()
  .padStart(2, '0')}`;
const filePath = `./db/migrations/${dateStr}-${migrationName}.ts`;

const data = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className} implements MigrationInterface {
  name = '${migrationName}-${timestamp}';

  public async up(queryRunner: QueryRunner): Promise<void> {
	// code goes here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
	// code goes here
  }
}
`;

fs.writeFileSync(filePath, data);
