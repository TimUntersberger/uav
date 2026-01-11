import config from "@uav/config";

export interface ServerDeps {
  defaultWalletAddress: string;
}

export function createServerDeps(): ServerDeps {
  return {
    defaultWalletAddress: config.walletAddress,
  };
}
