import type { NextConfig } from 'next';

const nextConfig: NextConfig = {  /* config options here */
  //new code because memory leak 

  //till above new code
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",   // dev
      },
      {
        protocol: "https",
        hostname: "your-domain.com",  // prod
      },
    ],

    localPatterns: [
      {
        pathname: "/api/**",  // covers /api/signed-url and any other api routes
        search: "**",
      },
      {
        pathname: "/customers/**",
      },
      {
        pathname: "/**",          // ← add this to allow all local images
      },
    ],
    // localPatterns: [
    //   {
    //     pathname: "/api/signed-url",
    //     search: "**", // allow any query string
    //   },
    //   {
    //     pathname: "/customers/**", // covers /customers/evil-rabbit.png etc
    //   },
    // ],
  },

  experimental: {
    webpackMemoryOptimizations: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
    }
    return config;
  },

  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "customer-documents.80ab2b0f13c925dd363fdefd2715ee55.r2.cloudflarestorage.com",
  //       port: "",
  //       pathname: "/**",
  //     },
  //   ],
  // },
};

export default nextConfig;
