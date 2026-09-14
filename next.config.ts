const gh = process.env.GITHUB_PAGES === "true";
const basePath = gh ? "/cekulink" : "";

const nextConfig = {
  output: "export" as const,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
