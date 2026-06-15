import { Pool } from 'pg';

const globalForPool = globalThis as typeof globalThis & {
  pgPool?: Pool;
};

/** One shared pg pool for the whole process (survives Nest dev hot-reload). */
export function getPgPool(): Pool {
  if (!globalForPool.pgPool) {
    const max = Number.parseInt(process.env.DATABASE_POOL_MAX ?? '5', 10);
    globalForPool.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL ?? '',
      max: Number.isNaN(max) ? 5 : max,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return globalForPool.pgPool;
}

export async function closePgPool(): Promise<void> {
  if (globalForPool.pgPool) {
    await globalForPool.pgPool.end();
    globalForPool.pgPool = undefined;
  }
}
