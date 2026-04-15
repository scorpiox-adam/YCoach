import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co"
      }
    ]
  }
};

export default withPWA({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true
})(nextConfig);
