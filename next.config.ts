import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Os e-books são lidos do disco em tempo de execução; garante que vão junto no deploy.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/landing.html" }], afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
