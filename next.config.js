const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    //generateSw: false,
    disable: process.env.NODE_ENV === "development",
  })
  
  const nextConfig = {
    reactStrictMode: true,
  }
  
  module.exports = withPWA(nextConfig)