import { useCallback, useEffect, useReducer } from "react"
import { Web3Context } from "./Web3Context"
// import { TezosToolkit } from '@taquito/taquito';
// import { BeaconWallet } from '@taquito/beacon-wallet'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  BraveWalletAdapter,
  CoinbaseWalletAdapter,
  Coin98WalletAdapter,
  ExodusWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider, useWalletModal } from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
require('@solana/wallet-adapter-react-ui/styles.css')

const INITIAL_STATE = {
  tezos: {
    address: null,
    publicKey: null,
    provider: null,
    chainError: false,
  },
}

function tezosReducer(state, action) {
  switch (action.type) {
    case 'SET_PROVIDER':
      return {
        ...state,
        tezos: {
          address: action.address,
          publicKey: action.publicKey,
          provider: action.provider,
        },
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        tezos: {
          address: action.address,
          publicKey: action.publicKey,
        },
      }
    case 'RESET_PROVIDER':
      return INITIAL_STATE
    case 'SET_CHAIN_ERROR':
      return {
        ...INITIAL_STATE,
        tezos: {
          chainError: true,
        },
      }
    default:
      throw new Error()
  }
}

let Tezos = null
let tezosWallet = null

if (typeof window !== 'undefined') {
  Tezos = new TezosToolkit('https://mainnet-tezos.giganode.io')
  tezosWallet = new BeaconWallet({ name: 'darkblock.io' })
  Tezos.setWalletProvider(tezosWallet)
}

export const Web3Provider = ({ children }) => {
  // const [state, dispatch] = useReducer(tezosReducer, INITIAL_STATE)
  // const { provider, address, publicKey, chainError } = state.tezos

  // const connect = useCallback(async function() {
  //   if (typeof window !== 'undefined') {
  //     try {
  //       let address = null
  //       let publicKey = null
  //       let provider = null
  //       let permissions = null
  //       const activeAccount = await tezosWallet.client.getActiveAccount()

  //       if (!activeAccount) {
  //         await tezosWallet.clearActiveAccount()
  //         permissions = await tezosWallet.client.requestPermissions()
  //         address = permissions.address
  //         publicKey = permissions.publicKey
  //         provider = tezosWallet
  //       } else {
  //         address = activeAccount.address
  //         publicKey = activeAccount.publicKey
  //         provider = tezosWallet
  //       }

  //       if (permissions || activeAccount) {
  //         dispatch({
  //           type: 'SET_PROVIDER',
  //           provider: provider,
  //           address: address,
  //           publicKey: publicKey,
  //           chainError: false,
  //         })
  //       } else {
  //         dispatch({
  //           type: 'SET_CHAIN_ERROR',
  //           chainError: true,
  //         })
  //       }
  //     } catch (error) {
  //       // connect()
  //     }
  //   }
  // }, [])

  // const disconnect = useCallback(async function() {
  //   if (typeof window !== 'undefined') {
  //     window.localStorage.removeItem('beacon:sdk-secret-seed')
  //     window.localStorage.removeItem('beacon:sdk_version')
  //     window.localStorage.removeItem('beacon:active-account')
  //     window.localStorage.removeItem('beacon:accounts')
  //     window.localStorage.removeItem('beacon:postmessage-peers-dapp')

  //     Tezos = new TezosToolkit('https://mainnet-tezos.giganode.io')
  //     tezosWallet = new BeaconWallet({ name: 'darkblock.io' })
  //     Tezos.setWalletProvider(tezosWallet)
  //   }

  //   dispatch({
  //     type: 'RESET_PROVIDER',
  //   })
  // }, [])

  // useEffect(() => {
  //   connect()
  // }, [])

  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [
    new BraveWalletAdapter(),
    new Coin98WalletAdapter(),
    new CoinbaseWalletAdapter(),
    new ExodusWalletAdapter(),
    new LedgerWalletAdapter(),
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new SolletWalletAdapter({ network }),
    new SolletExtensionWalletAdapter({ network }),
  ]

  return (
    <Web3Context.Provider value={{ address, publicKey, connect, disconnect, provider, chainError }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            { children }
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Web3Context.Provider>
  )
}
