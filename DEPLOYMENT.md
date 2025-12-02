# Deployment Guide

## Prisma Setup

This project uses Prisma ORM with PostgreSQL. Ensure the following before deployment:

### 1. Environment Variables

Make sure these are set in your deployment platform:

```
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key-here"
```

### 2. Build Process

The `package.json` includes:
- `postinstall`: Automatically runs `prisma generate` after `npm install`
- `build`: Runs `prisma generate && next build`

This ensures Prisma Client is generated before the build.

### 3. Database Migrations

Before deploying, run migrations:

```bash
npx prisma migrate deploy
```

Or if using Prisma Accelerate:
```bash
npx prisma db push
```

### 4. Platform-Specific Notes

#### Vercel
- Add `DATABASE_URL` and `JWT_SECRET` in Environment Variables
- Vercel will automatically run `postinstall` and `build` scripts
- No additional configuration needed

#### Railway/Render
- Add environment variables in dashboard
- Ensure `postinstall` script runs (should be automatic)
- Database migrations run automatically if configured

#### Other Platforms
- Ensure `npm install` runs (triggers `postinstall`)
- Ensure `npm run build` runs (includes `prisma generate`)
- Run `npx prisma migrate deploy` before first deployment

### 5. Troubleshooting

If you see "Module not found: Can't resolve '@prisma/client'":
1. Ensure `prisma generate` runs before build
2. Check that `@prisma/client` is in `package.json` dependencies
3. Verify `DATABASE_URL` is set correctly

