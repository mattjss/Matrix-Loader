/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/Matrix-Loader",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
