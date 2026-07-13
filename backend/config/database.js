const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase requires SSL; skip certificate verification for self-signed certs
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
});

// Verify connection on startup
pool.query('SELECT 1').then(() => {
  console.log('✅ Database ping successful');
}).catch((err) => {
  console.error('❌ Database connection failed:', err.message);
  console.error('⚠️  Make sure DATABASE_URL is set correctly in .env');
});

// ── Compatibility shim ──────────────────────────────────────────
// Mimics the mysql2 promise-pool API so existing route code works unchanged:
//   • Converts ? placeholders → $1, $2, … (PostgreSQL positional params)
//   • Returns [rows, fields] so `const [rows] = await db.query(…)` still works
// ───────────────────────────────────────────────────────────────
const db = {
  query: async (sql, params = []) => {
    let idx = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++idx}`);
    const result = await pool.query(pgSql, params);
    return [result.rows, result.fields ?? []];
  },

  // Expose a connection handle for code that calls getConnection()
  getConnection: async () => {
    const client = await pool.connect();
    return {
      query: async (sql, params = []) => {
        let idx = 0;
        const pgSql = sql.replace(/\?/g, () => `$${++idx}`);
        const result = await client.query(pgSql, params);
        return [result.rows, result.fields ?? []];
      },
      release: () => client.release(),
    };
  },
};

module.exports = db;
