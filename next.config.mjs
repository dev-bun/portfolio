/** @type {import('next').NextConfig} */
import config from './next-i18next.config.js'

const nextConfig = {
  reactStrictMode: true,
  i18n: config.i18n
};

export default nextConfig;
