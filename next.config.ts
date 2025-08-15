import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  webpack(config) {
    // Elimina cualquier regla previa que maneje .svg
    config.module.rules = config.module.rules.map((rule: any) => {
      if (rule.test?.test?.(".svg")) {
        return { ...rule, exclude: /\.svg$/i };
      }
      return rule;
    });

    // Maneja todos los .svg como componentes React
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
