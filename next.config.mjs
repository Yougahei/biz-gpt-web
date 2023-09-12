/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://192.168.0.7:5000/:path*',
      },
    ]
  }
}

export default nextConfig
