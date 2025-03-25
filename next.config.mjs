/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/calendar',
        destination: '/calendar/days',
        permanent: true,
      },
    ];
  },
}

export default nextConfig
