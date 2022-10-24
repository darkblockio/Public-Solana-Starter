import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'

const SolanaDarkblockWidget = dynamic(
  () =>
    import('@darkblock.io/sol-widget').then((mod) => {
      return mod.SolanaDarkblockWidget
    }),
  { ssr: false }
)

const SolUpgradeWidget = dynamic(
  () =>
    import('@darkblock.io/sol-widget').then((mod) => {
      return mod.SolUpgradeWidget
    }),
  { ssr: false }
)

const cb = (param1) => {
  // console.log('solWidget cb:', param1)
}

const cbUpgrade = (param1) => {
  if (param1 === 'upload_complete') {
    Router.reload()
  }
}

const config = {
  customCssClass: '', // pass here a class name you plan to use
  debug: false, // debug flag to console.log some variables
  imgViewer: {
    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
}

const apiKey = process.env.NEXT_PUBLIC_REACT_APP_API_KEY

export const SolWidget = ({ id, upgrade = false }) => {
  const walletAdapter = useWallet()

  if (walletAdapter && walletAdapter.connected) {
    if (upgrade) {
      return (
        <SolUpgradeWidget
          apiKey={apiKey}
          tokenId={id}
          walletAdapter={walletAdapter.connected ? walletAdapter : null}
          cb={cbUpgrade}
          config={config}
        />
      )
    } else {
      return (
        <SolanaDarkblockWidget
          cb={(state) => cb(state)}
          tokenId={id}
          walletAdapter={walletAdapter.connected ? walletAdapter : null}
          config={config}
        />
      )
    }
  } else {
    return <div></div>
  }
}
