// hooks/perfx/use-perfx-program.ts
'use client'; // This hook uses client-side React hooks

import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

import { useAnchorProvider } from '@/components/solana/solana-provider'; // Adjust path
import { useCluster } from '@/components/cluster/cluster-data-access'; // Adjust path if needed

// Import the generated IDL and types
import { PerfxIDL } from '@project/anchor'; // Assuming this correctly imports your perfx.json
import type { Perfx } from '@project/anchor'; // Assuming this correctly imports your types

// Re-export the generated IDL and type for convenience
export { Perfx, PerfxIDL };

// Keep this for getPerfxProgramId logic
export const PERFX_PROGRAM_ID_DEVNET = new PublicKey('5nY3QahMe7YyWoqbmxeeb71RJoZJjeP3HdV8WBGnder9');

// This is a helper function to get the program ID depending on the cluster.
export function getPerfxProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
        return PERFX_PROGRAM_ID_DEVNET; // Return the Devnet/Testnet ID
    case 'mainnet-beta':
    default:
      // Return the IDL address for mainnet-beta or default
      // Make sure PerfxIDL.address is correct for your mainnet deployment if you have one
      // You might want to add error handling here if PerfxIDL.address is missing
      return new PublicKey(PerfxIDL.address); // Use the original IDL address string
  }
}

// This hook provides access to the Anchor program instance.
export function usePerfxProgram() {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();

  console.log("usePerfxProgram: Detected cluster network:", cluster?.network);

  // Get the program ID based on the current cluster
  const programId = useMemo(() => {
     if (!cluster || !cluster.network) {
         console.warn("usePerfxProgram: cluster or network is undefined/null.");
         // Return a default or null if cluster isn't immediately available
         return null; // Return null if cluster info is missing
     }
     const id = getPerfxProgramId(cluster.network as Cluster);
     console.log("usePerfxProgram: Derived Program ID based on cluster:", id.toBase58());
     return id;
  }, [cluster]); // Re-derive programId when cluster changes


  // Create the program instance using the IDL and provider
  const program = useMemo(() => {
    // Need both provider AND the correctly derived programId to create the program instance
    if (!provider || !programId) {
        console.log("usePerfxProgram: Provider or Program ID not available, cannot create program instance.");
        return null; // Cannot create program instance without provider or derived ID
    }

    // --- WORKAROUND FOR THE TYPE DEFINITION ---
    // 1. Create a *copy* of the IDL object.
    // 2. Overwrite the 'address' field in the copied IDL with the correct derived programId.
    // 3. Pass this modified IDL copy and the provider to the constructor.
    const modifiedIdl = {
        ...PerfxIDL, // Copy original IDL properties
        address: programId.toBase58(), // **Overwrite** the address with the correct ID string
    };

    console.log("usePerfxProgram: Creating Program instance with ID (from modified IDL address):", modifiedIdl.address);

    // Now call the constructor using the signature TypeScript expects
    // It will use the 'address' field from modifiedIdl
    // Use 'as any' if the 'modifiedIdl' type doesn't strictly match 'idl: any'
    return new Program(modifiedIdl as any, provider);
    // ----------------------------------------

  }, [provider, programId]); // Recreate program if provider or programId changes


  return {
    program,
    // It's helpful to return the final programId being used too
    // Access program.programId for the ID the instance is actually using
    programId: program?.programId || programId,
  };
}