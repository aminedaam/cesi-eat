import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "bchef.fr",
        pathname: "**",
      },
    ],
  },
  // Ajout des configurations pour la production
  output: 'standalone',
  poweredByHeader: false,
  // Configuration pour gérer les routes dynamiques
  async rewrites() {
    return [
      {
        source: '/restaurants/:id',
        destination: '/restaurants/[id]',
      },
    ];
  },
};

export default nextConfig;