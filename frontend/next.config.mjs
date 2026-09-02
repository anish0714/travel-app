/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This dev machine's Node.js process doesn't trust a locally-installed
    // root CA that curl/browsers do (corporate proxy or AV TLS inspection),
    // which breaks Next's server-side image-optimization fetch for remote
    // images. Skipping the optimizer lets the browser fetch them directly.
    unoptimized: true,
  },
};

export default nextConfig;
