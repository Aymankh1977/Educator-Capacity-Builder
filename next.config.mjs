/** @type {import('next').NextConfig} */
const nextConfig = {
  // /rationale reads research/iteration-log.md at request time; include it in the deployed function.
  outputFileTracingIncludes: {
    "/rationale": ["./research/**/*.md"],
  },
};
export default nextConfig;
