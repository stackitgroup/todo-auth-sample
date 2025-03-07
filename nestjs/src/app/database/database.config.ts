import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type DatabaseType = 'postgres' | 'mysql' | 'mariadb';

export const getDatabaseConfig = (configService: ConfigService) : TypeOrmModuleOptions => {
  const dbType = configService.get<DatabaseType>('DB_TYPE', 'postgres');

  console.log("📌 TYPE OF  DATABSE:", dbType);

  // agregar sqlite
  return {
    type: dbType,
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [__dirname + '/../../contexts/v1/**/domain/entities/*.entity.{ts,js}'],
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
    logging: configService.get<boolean>('DB_LOGGING'),
  };
};
