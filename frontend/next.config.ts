import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.57", "kumtho.trueddns.com"],
  webSocketProxy: true,
  devIndicators: false
};

export default nextConfig;
