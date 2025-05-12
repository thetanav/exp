import { UserButton } from "@civic/auth/react";
import Link from "next/link";
import { useUser } from "@civic/auth-web3/react";

export default function UserLogin() {
  const { user } = useUser();
  return (
    <div className="fixed right-0 top-0 flex items-center">
      {user && (
        <Link
          href="/wallet"
          className="px-6 py-2 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center hover:bg-purple-600 transition-colors">
          Wallet
        </Link>
      )}
      <UserButton className="text-sm !border-none !hover:none" />
    </div>
  );
}
