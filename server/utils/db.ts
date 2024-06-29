import postgres from 'postgres';

export const sql = postgres({
  host: process.env.PGHOST,
  port: 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: true,
  max: 1,
}); // will use psql environment variables
