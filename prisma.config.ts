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
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
