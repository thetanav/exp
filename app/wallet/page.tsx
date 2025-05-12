// app/wallet/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";

type Network = "ethereum" | "solana";

interface Token {
  symbol: string;
  balance: string;
  price: number;
}

interface Transaction {
  hash: string;
  type: "send" | "receive";
  amount: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

const UserImage = ({ src }: { src: string }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-12 h-12 border rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
      {imgError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt="user avatar"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

const WalletPage = () => {
  const userContext: any = useUser();

  useEffect(() => {
    if (userContext.user) {
      console.log("User picture URL:", userContext.user.picture);
    }
  }, [userContext.user]);

  const [walletCreated, setWalletCreated] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("ethereum");
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([
    { symbol: "ETH", balance: "0.00", price: 0 },
    { symbol: "USDC", balance: "0.00", price: 0 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);

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
  }, [userContext.user]);

  const getNetworkAddress = () => {
    if (!userContext.user) return "";
    return selectedNetwork === "ethereum"
      ? userContext.ethereum?.address
      : userContext.solana?.address;
  };

  const getNetworkBalance = () => {
    if (!userContext.user) return "0.00";
    if (selectedNetwork === "solana") {
      return "0.00 SOL";
    }
    return userContext.ethereum?.balance
      ? `${userContext.ethereum.balance} ETH`
      : "0.00 ETH";
  };

  const getNetworkStatus = () => {
    if (!userContext.user) return "Disconnected";
    return selectedNetwork === "ethereum"
      ? "Ethereum Mainnet"
      : "Solana Mainnet";
  };

  const getNetworkIcon = () => {
    if (!userContext.user) return "🔴";
    return selectedNetwork === "ethereum" ? "🟢" : "🟡";
  };

  const handleSend = async (recipient: string, amount: string) => {
    try {
      // Implement send transaction logic using Civic's wallet
      setShowSendModal(false);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-8">Wallet Dashboard</h1>

      {userContext.user ? (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <UserImage src={userContext.user.picture} />
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
                <div className="flex items-center space-x-2">
                  <span>{getNetworkIcon()}</span>
                  <span className="text-sm text-gray-600">
                    {getNetworkStatus()}
                  </span>
                </div>
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
                  Balance
                </h3>
                <p className="text-2xl font-bold">{getNetworkBalance()}</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setShowSendModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Send
                  </button>
                  <button
                    onClick={() => setShowReceiveModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Receive
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Tokens</h3>
                <div className="space-y-4">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-gray-500">
                          ${token.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">{token.balance}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No transactions yet
                    </p>
                  ) : (
                    transactions.map((tx) => (
                      <div
                        key={tx.hash}
                        className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {tx.type === "send" ? "Sent" : "Received"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              tx.type === "send"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}>
                            {tx.type === "send" ? "-" : "+"}
                            {tx.amount}
                          </p>
                          <p className="text-sm text-gray-500">{tx.status}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Send Tokens</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient Address"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  Cancel
                </button>
                <button
                  onClick={() => handleSend("", "")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Receive Tokens</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-500 mb-2">Your Address</p>
                <p className="font-mono text-sm break-all">
                  {getNetworkAddress()}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowReceiveModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
