/** @type {import('next').NextConfig} */
import config from './next-i18next.config.js'

const nextConfig = {
  reactStrictMode: true,
  i18n: config.i18n,
  images: {
    /*remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/images/*"
      }
    ]*/
    domains: ["i.scdn.co", "image-cdn-ak.spotifycdn.com"]
  }
};

export default nextConfig;
