/** @type {import('next').NextConfig} */
let nextConfig = {};

if (process.env.NEXT_OUTPUT_STANDALONE === 'true') {
  nextConfig.output = 'standalone';
}

export default nextConfig;
