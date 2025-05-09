// app/page.tsx or any other client component page/file
'use client';

import { AddOrderButton } from '@/components/addOrder'; // Adjust path
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'; // Example wallet connect button

export default function Home() {
  return (
    <div>
      <h1>Perfx App</h1>

      {/* Add the initialize button */}
      <AddOrderButton/>

      {/* Other components */}
    </div>
  );
}