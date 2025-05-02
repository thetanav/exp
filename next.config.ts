import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "bc677493-6ff1-4cf5-9953-a99056c6bbc5",
});

export default withCivicAuth(nextConfig);

// export default nextConfig;
