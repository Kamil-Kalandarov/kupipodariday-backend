/* ФАЙЛ КОНФИГУРАЦИИ ДЛЯ ПОДКЛЮЧЕНИЯ ПРИЛОЖЕНИЯ К БД (данные берутся из файла .env) */
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [],
    synchronize: true,
  },
});
