import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
                protocol: "https",
                hostname: "encrypted-tbn0.gstatic.com",


      },
       {
                protocol: "https",
                hostname: "cdn.tarhpik.com",


      },
       {
                protocol: "https",
                hostname: "cdn.mashreghnews.ir",


      },
      {
                protocol: "https",
                hostname: "i1.delgarm.com",


      },
      {
                protocol: "https",
                hostname: "cdn.nody.ir",


      },
       {
                protocol: "https",
                hostname: "nl.pinterest.com",


      },
       {
                protocol: "https",
                hostname: "i1.delgarm.com",


      }
    ],
  },
};

export default nextConfig;