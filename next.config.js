/** @type {import('next').NextConfig} */
const nextConfig = {
  // 確保 Vercel 正確處理 App Router 與靜態路由
  trailingSlash: false,
};

module.exports = nextConfig;
