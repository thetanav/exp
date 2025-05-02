// app/wallet/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { useConnect, useAccount, useBalance } from "wagmi";

type Network = "ethereum" | "solana";

const WalletPage = () => {
  const userContext: any = useUser();
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const [walletCreated, setWalletCreated] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("ethereum");

  useEffect(() => {
    const setupWallet = async () => {
      if (userContext.user && !userHasWallet(userContext)) {
        setIsCreatingWallet(true);
        await userContext.createWallet();
        setWalletCreated(true);
        setIsCreatingWallet(false);
      }
    };
    setupWallet();
  }, [userContext]);

  const connectWallet = () => {
    const civicConnector = connectors.find(
      (connector) => connector.id === "civic"
    );
    if (civicConnector) {
      connect({ connector: civicConnector });
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const getNetworkAddress = () => {
    if (!userContext.user) return "";
    return selectedNetwork === "ethereum"
      ? userContext.ethereum?.address
      : userContext.solana?.address;
  };

  const getNetworkBalance = () => {
    if (selectedNetwork === "solana") {
      // For Solana, we would need to implement a different balance fetching mechanism
      return "0.00 SOL";
    }
    return balance
      ? `${(BigInt(balance.value) / BigInt(1e18)).toString()} ${balance.symbol}`
      : "0.00";
  };

  return (
    <div className="max-w-screen-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Wallet Dashboard</h1>

      {userContext.user ? (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl font-semibold">
                {userContext.user.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, {userContext.user.email}
              </h2>
              <p className="text-gray-600">Manage your wallet and assets</p>
            </div>
          </div>

          {!userHasWallet(userContext) && !walletCreated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                <p className="text-yellow-700">Creating your wallet...</p>
              </div>
            </div>
          )}

          {userHasWallet(userContext) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Network</h3>
                <select
                  value={selectedNetwork}
                  onChange={(e) =>
                    setSelectedNetwork(e.target.value as Network)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="ethereum">Ethereum</option>
                  <option value="solana">Solana</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {selectedNetwork === "ethereum"
                    ? "ETH Address"
                    : "SOL Address"}
                </h3>
                <p className="font-mono text-sm break-all">
                  {getNetworkAddress()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Balance
                </h3>
                {isBalanceLoading && selectedNetwork === "ethereum" ? (
                  <LoadingSkeleton />
                ) : (
                  <p className="text-2xl font-bold">{getNetworkBalance()}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {isConnected ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Wallet Connected</span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
