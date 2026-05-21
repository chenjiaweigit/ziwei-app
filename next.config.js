/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'iztro',
    'lunar-javascript',
    'openai',
    'jsonwebtoken',
  ],
};

module.exports = nextConfig;
