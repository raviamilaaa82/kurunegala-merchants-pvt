import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "your-domain.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/**",
        search: "**",
      },
      {
        pathname: "/customers/**",
      },
      {
        pathname: "/**",
      },
    ],
  },

  turbopack: {}, // ✅ acknowledges Turbopack, silences the error

  // webpack block removed — Turbopack handles watching natively
};

export default nextConfig;











// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {  /* config options here */
//   //new code because memory leak 

//   //till above new code
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",   // dev
//       },
//       {
//         protocol: "https",
//         hostname: "your-domain.com",  // prod
//       },
//     ],

//     localPatterns: [
//       {
//         pathname: "/api/**",  // covers /api/signed-url and any other api routes
//         search: "**",
//       },
//       {
//         pathname: "/customers/**",
//       },
//       {
//         pathname: "/**",          // ← add this to allow all local images
//       },
//     ],

//   },

//   experimental: {
//     webpackMemoryOptimizations: true,
//   },
//   webpack: (config, { dev }) => {
//     if (dev) {
//       config.watchOptions = {
//         poll: 1000,
//         aggregateTimeout: 300,
//         ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
//       };
//     }
//     return config;
//   },


// };

// export default nextConfig;
