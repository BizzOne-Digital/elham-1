import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "netbrandit.com" }],
        destination: "https://www.netbrandit.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/uploads/**",
      },
      {
        pathname: "/images/**",
      },
      {
        pathname: "/brand/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
