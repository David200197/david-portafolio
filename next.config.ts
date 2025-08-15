import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  webpack(config) {
    // Configuración específica para SVGR (SVG como componentes React)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false, // Preserva viewBox
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    // Configuración para SVG como URLs (opcional)
    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset",
      resourceQuery: /url/, // *.svg?url
    });

    config.resolve.extensions.push(".json");

    return config;
  },
};

export default nextConfig;
