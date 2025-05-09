// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import PerfxIDL from '../target/idl/perfx.json'
import type { Perfx } from '../target/types/perfx'

// Re-export the generated IDL and type
export { Perfx, PerfxIDL }

// The programId is imported from the program IDL.
export const COUNTER_PROGRAM_ID = new PublicKey(PerfxIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getPerfxProgram(provider: AnchorProvider, address?: PublicKey): Program<Perfx> {
  return new Program({ ...PerfxIDL, address: address ? address.toBase58() : PerfxIDL.address } as Perfx, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getPerfxProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'testnet':
    case 'devnet':
      // This is the program ID for the Counter program on devnet and testnet.
      return new PublicKey('6KtqZCuJ5BgGY4jmxQW7LkiVZiRckfFMr3uKjr3eewVZ')
    case 'mainnet-beta':
    default:
      return COUNTER_PROGRAM_ID
  }
}
