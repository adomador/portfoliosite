/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: false },
      { source: '/work', destination: '/#work', permanent: false },
    ]
  },
}

module.exports = nextConfig