import postgres from 'postgres';

export const sql = postgres({
  host: process.env.PGHOST,
  port: 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.SSL != 'false',
  max: 5,
}); // will use psql environment variables
