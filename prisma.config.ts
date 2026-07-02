import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ||
  "mysql://root:password@127.0.0.1:3306/shivara";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "TS_NODE_COMPILER_OPTIONS={\"module\":\"CommonJS\"} ts-node prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
