import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A second production build beside the first (`NEXT_DIST_DIR=.next-b`), served on another port, so a fix can be
  // UAT'd in new windows while windows on the previous build are still running (RULE Z: parallel is the default).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // LE-15n: a build whose functions keep their names, so a profile of the editor says where the time goes (PROFILE_BUILD=1, built
  // into its own NEXT_DIST_DIR and deleted after — never the build that ships)
  ...(process.env.PROFILE_BUILD === "1" ? { webpack: (config: { optimization: { minimize: boolean } }) => { config.optimization.minimize = false; return config; } } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

export default nextConfig;
