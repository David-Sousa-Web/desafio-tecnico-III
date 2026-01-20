import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768876240481 implements MigrationInterface {
    name = 'InitialSchema1768876240481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pacientes\` (\`id\` varchar(36) NOT NULL, \`nome\` varchar(255) NOT NULL, \`data_nascimento\` date NOT NULL, \`documento\` varchar(20) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_33ca77b5c51990d84f5f1dc07d\` (\`documento\`), UNIQUE INDEX \`IDX_33ca77b5c51990d84f5f1dc07d\` (\`documento\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exames\` (\`id\` varchar(36) NOT NULL, \`paciente_id\` varchar(255) NOT NULL, \`modalidade\` enum ('CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA') NOT NULL, \`data_exame\` date NOT NULL, \`idempotency_key\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_940b1263d77dc77b079dfd019f\` (\`idempotency_key\`), UNIQUE INDEX \`IDX_940b1263d77dc77b079dfd019f\` (\`idempotency_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`exames\` ADD CONSTRAINT \`FK_86b3eb7331d6cd2914e776bcef6\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exames\` DROP FOREIGN KEY \`FK_86b3eb7331d6cd2914e776bcef6\``);
        await queryRunner.query(`DROP INDEX \`IDX_940b1263d77dc77b079dfd019f\` ON \`exames\``);
        await queryRunner.query(`DROP INDEX \`IDX_940b1263d77dc77b079dfd019f\` ON \`exames\``);
        await queryRunner.query(`DROP TABLE \`exames\``);
        await queryRunner.query(`DROP INDEX \`IDX_33ca77b5c51990d84f5f1dc07d\` ON \`pacientes\``);
        await queryRunner.query(`DROP INDEX \`IDX_33ca77b5c51990d84f5f1dc07d\` ON \`pacientes\``);
        await queryRunner.query(`DROP TABLE \`pacientes\``);
    }

}
