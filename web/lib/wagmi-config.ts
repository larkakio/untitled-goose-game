import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { injected, baseAccount, walletConnect } from "@wagmi/connectors";
import { getTargetChainId } from "./env";

const targetChainId = getTargetChainId();

const targetChain =
  targetChainId === baseSepolia.id
    ? baseSepolia
    : targetChainId === base.id
      ? base
      : base;

const wcId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const connectors = [
  injected(),
  baseAccount({
    appName: "Neon Honk Heist",
  }),
  ...(wcId
    ? [
        walletConnect({
          projectId: wcId,
          showQrModal: true,
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export { targetChain };
