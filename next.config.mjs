/** @type {import('next').NextConfig} */
import config from './next-i18next.config.js'

const nextConfig = {
  reactStrictMode: true,
  i18n: config.i18n,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/'
      }
    })

    // Overcome Webpack referencing `window` in chunks
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`

    // Important: return the modified config
    return config
  },
  images: {
    /*remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/images/*"
      }
    ]*/
    domains: ["i.scdn.co", "image-cdn-ak.spotifycdn.com", "assets-global.website-files.com", "cdn.discordapp.com", "raw.githubusercontent.com"]
  }
};

export default nextConfig;
