import { defineConfig, env } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV !== "production"
    ? "mysql://root:password@localhost:3306/shivara"
    : env("DATABASE_URL"));

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production") {
  process.env.DATABASE_URL = databaseUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
