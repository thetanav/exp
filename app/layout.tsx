"use client";

import "@/app/globals.css";
import { Geist } from "next/font/google";
import { CivicAuthProvider } from "@civic/auth-web3/nextjs";
import { WagmiProvider, createConfig, http } from "wagmi";
//@ts-ignore
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { embeddedWallet } from "@civic/auth-web3/wagmi";
import { mainnet } from "viem/chains";

const geist = Geist({ subsets: ["latin"] });

// export const metadata = {
//   title: "Expense Tracker",
//   description: "Track your expenses and earnings",
// };

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [embeddedWallet()],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider>
          <html lang="en">
            <body
              className={`${geist.className} max-w-md h-screen mx-auto light`}>
              <div className="w-full h-full">{children}</div>
            </body>
          </html>
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
