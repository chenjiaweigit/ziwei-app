/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'iztro',
    'lunar-javascript',
    'openai',
    'jsonwebtoken',
    'pg',
    'pg-native',
  ],
};

module.exports = nextConfig;
