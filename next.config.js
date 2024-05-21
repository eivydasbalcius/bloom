const { hostname } = require("os");

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/*",
      },
    ],
    domains: ["tailwindui.com", "blueviolet-antelope-713639.hostingersite.com"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Your other Next.js configuration options here
};
