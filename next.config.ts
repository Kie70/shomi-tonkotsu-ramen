import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const isGitHubPagesBuild = process.env.GITHUB_PAGES_BUILD === 'true';

const nextConfig: NextConfig = isGitHubPagesBuild
  ? {
      output: 'export',
      trailingSlash: true,
      basePath,
      assetPrefix: basePath || undefined,
    }
  : {};

export default nextConfig;
