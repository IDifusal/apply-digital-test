export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  cron: process.env.SYNC_CRON || '0 * * * *',
  contentful: {
    space: process.env.CONTENTFUL_SPACE_ID,
    token: process.env.CONTENTFUL_ACCESS_TOKEN,
    env: process.env.CONTENTFUL_ENVIRONMENT,
    type: process.env.CONTENTFUL_CONTENT_TYPE || 'product',
  },
});
