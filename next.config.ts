/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carpool-media.5dce6dd8fd2b8c12742c81bbb251a9ca.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "carpool-app.5dce6dd8fd2b8c12742c81bbb251a9ca.r2.cloudflarestorage.com",
        pathname: "/**",
      }
    ],
  },
})