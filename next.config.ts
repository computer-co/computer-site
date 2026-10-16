import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone com server.js mínimo — usado pelo Dockerfile (deploy na Hetzner/Easypanel).
  output: "standalone",
  images: {
    // As fotos-fonte têm no máx. 1920px de largura — não otimizar acima disso
    // (evita upscale desnecessário e acelera a otimização).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
