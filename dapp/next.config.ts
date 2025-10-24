import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle HashConnect and related dependencies
    config.externals = config.externals || [];

    if (isServer) {
      config.externals.push({
        bufferutil: 'bufferutil',
        'utf-8-validate': 'utf-8-validate',
      });
    }

    // Ignore problematic node modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
        // Fix for @metamask/sdk React Native async-storage dependency
        '@react-native-async-storage/async-storage': false,
        // Fix for @walletconnect/logger pino-pretty dependency
        'pino-pretty': false,
        // Additional Node.js modules that might cause issues
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    // Suppress warnings for known dynamic requires in HashConnect and web3 libraries
    config.ignoreWarnings = [
      { module: /node_modules\/@hashgraph\/hedera-wallet-connect/ },
      { module: /node_modules\/hashconnect/ },
      { module: /node_modules\/@metamask\/sdk/ },
      { module: /node_modules\/@walletconnect/ },
      /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
      /Module not found: Can't resolve '@react-native-async-storage\/async-storage'/,
      /Module not found: Can't resolve 'pino-pretty'/,
    ];

    // Try to prevent identifier collisions by ensuring unique variable names
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        mangleExports: false,
        moduleIds: 'named',
      };
    }

    return config;
  },
};

export default nextConfig;
