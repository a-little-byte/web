import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        "better-sqlite3",
        "mysql2",
        "oracledb",
        "sqlite3",
        "tedious",
        "mysql",
        "pg-query-stream",
        "hash",
        "knex",
        "casbin",
        "casbin-basic-adapter",
        { "knex/lib/migrations": "knex/lib/migrations" },
        {
          "knex/lib/migrations/util/import-file":
            "knex/lib/migrations/util/import-file",
        },
      ];
      config.node = {
        __dirname: true,
        __filename: true,
      };
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "alittlebyte",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  disable: process.env.NODE_ENV === "development",
  hideSourceMaps: process.env.NODE_ENV === "development",
});
