'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { usePerfxProgram } from '@/hooks/use-perfx-program';
import { useState } from 'react';

export function AddOrderButton() {
  const { publicKey, connected } = useWallet();
  const { program } = usePerfxProgram();
  const [orderInput, setOrderInput] = useState('');

  const addOrderMutation = useMutation({
    mutationKey: ['perfx', 'addOrder', publicKey?.toBase58()],
    mutationFn: async () => {
      if (!program) throw new Error('Program not loaded');
      if (!publicKey) throw new Error('Wallet not connected');
      if (!orderInput.trim()) throw new Error('Order input cannot be empty');

      console.log("Attempting to add order...");
      console.log("User Public Key:", publicKey.toBase58());
      console.log("Program ID:", program.programId.toBase58());
      console.log("Order:", orderInput);

      const signature = await program.methods
        .addOrder(orderInput)
        .accounts({
          payer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction sent:", signature);
      return signature;
    },
    onSuccess: (signature) => {
      console.log('Order added successfully! Transaction Signature:', signature);
      alert(`Order added successfully! Tx: ${signature}`);
      setOrderInput(''); // Clear input after success
    },
    onError: (error: Error) => {
      console.error('Failed to add order:', error);
      alert(`Failed to add order: ${error.message}`);
    },
  });

  const isPending = addOrderMutation.status === 'pending';
  const isDisabled = !connected || isPending || !orderInput.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="text"
        value={orderInput}
        onChange={(e) => setOrderInput(e.target.value)}
        placeholder="Enter order (e.g., Buy 10 BTC)"
        style={{
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          width: '300px',
        }}
        disabled={isPending}
      />
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          backgroundColor: isDisabled ? '#cccccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          opacity: isDisabled ? 0.7 : 1,
        }}
        onClick={() => addOrderMutation.mutate()}
        disabled={isDisabled}
      >
        {isPending ? 'Processing...' : 'Add Order'}
      </button>
      {!connected && <p style={{ color: 'gray', marginTop: '10px' }}>Connect your wallet to add an order.</p>}
      {isPending && <p style={{ color: 'blue', marginTop: '10px' }}>Waiting for transaction confirmation...</p>}
    </div>
  );
}