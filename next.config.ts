import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
      },
    ],
  },
  env: {
    DATABASE_URL:
      process.env.NODE_ENV === "production"
        ? "postgresql://neondb_owner:npg_cZukEFB3mR2J@ep-snowy-fire-a5zxxs4w-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
        : "postgresql://postgres:Gunna@localhost:5432/ai_note_app_db?schema=public",
  },
};

export default nextConfig;
