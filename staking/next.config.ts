import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const prodEnvPath = path.join(process.cwd(), ".env.prod");
if ((process.env.APP_ENV === "prod" || process.env.NODE_ENV === "production") && fs.existsSync(prodEnvPath)) {
	dotenv.config({ path: prodEnvPath, override: false, quiet: true });
}

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
