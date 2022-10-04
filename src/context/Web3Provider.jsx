import { useEffect, useState } from "react"
import { Web3Context } from "./Web3Context"
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
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
} from "@solana/wallet-adapter-wallets"
import {
  WalletModalProvider,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
require("@solana/wallet-adapter-react-ui/styles.css")

const SolanaContext = ({ children }) => {
  const [address, setAddress] = useState(null)
  const walletAdapter = useWallet()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    if (walletAdapter.connected) {
      setAddress(walletAdapter.publicKey.toBase58())
    }
  }, [walletAdapter.connected]) // eslint-disable-line

  const disconnect = () => {
    setAddress(null)
    walletAdapter.disconnect()
  }

  const connect = () => {
    setVisible(true)
  }

  useEffect(() => {
    console.log("connecting...", walletAdapter.connected)
    connect()
  }, []) // eslint-disable-line

  return (
    <Web3Context.Provider value={{ address, connect, disconnect, walletAdapter }} >
      { children }
    </Web3Context.Provider>
  )
}

export const Web3Provider = ({ children }) => {
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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaContext>
            {children}
          </SolanaContext>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
