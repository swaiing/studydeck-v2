# Database Connection Setup

## 🔧 Supabase + Prisma Configuration

### The Problem
When using **Supabase connection pooling** (pgBouncer) with **Prisma**, you may encounter:
```
Error: prepared statement "s16" does not exist
```

This happens because:
- Supabase uses pgBouncer for connection pooling (port 6543)
- Prisma uses prepared statements by default
- pgBouncer in transaction mode doesn't support prepared statements

### The Solution

**Always add `?pgbouncer=true&connection_limit=1` to your DATABASE_URL**

## ✅ Correct Configuration

### Local Development (`.env.local`)
```bash
# Connection Pooling (for queries)
DATABASE_URL="postgresql://postgres.txkkkdjeimbidwephsok:wejpiq-ranryf-qijgE7@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres.txkkkdjeimbidwephsok:wejpiq-ranryf-qijgE7@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

### Production (Vercel)
Set in Vercel dashboard with the **same parameters**:
```bash
vercel env add DATABASE_URL production
# Paste: postgresql://...?pgbouncer=true&connection_limit=1
```

## 🎯 What Each Parameter Does

| Parameter | Purpose |
|-----------|---------|
| `?pgbouncer=true` | Disables prepared statements in Prisma |
| `&connection_limit=1` | Limits connections (recommended for dev) |
| Port `6543` | Supabase pooled connection |
| Port `5432` | Supabase direct connection (migrations) |

## 🚨 When to Use Each Connection

| Use Case | Connection | Port |
|----------|------------|------|
| **Queries (read/write)** | `DATABASE_URL` | 6543 (pooled) |
| **Migrations** | `DIRECT_URL` | 5432 (direct) |
| **Prisma Studio** | `DIRECT_URL` | 5432 (direct) |

## 🔄 If You Get the Error Again

**Quick Fix:**
1. Check your `.env.local` has `?pgbouncer=true`
2. Restart the dev server: `npm run dev`
3. Clear cache if needed: `rm -rf .next/cache`

**Alternative (if still having issues):**
Use direct connection for local dev:
```bash
# In .env.local, use DIRECT_URL for DATABASE_URL
DATABASE_URL="postgresql://...@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

## 📚 More Info
- [Prisma + Supabase Guide](https://www.prisma.io/docs/guides/database/supabase)
- [pgBouncer Documentation](https://www.pgbouncer.org/)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

**Last Updated:** 2026-02-08
**Status:** ✅ Configured for both local and production
