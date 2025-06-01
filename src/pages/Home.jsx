import React, { useState } from 'react';
import { FaLock, FaUsers, FaBolt, FaCheckCircle, FaShieldAlt, FaCogs, FaMobileAlt, FaCopy } from "react-icons/fa";
// import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useHistory } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { usePublicClient, useWalletClient, useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEERC } from "@avalabs/ac-eerc-sdk"
import { circuitURLs, EERCAddress } from '../utils';
import toast from 'react-hot-toast';

export default function Home() {
  // const { open } = useAppKit();
  // const { address, isConnected } = useAppKitAccount();
  const [decryptedKey, setDecryptedKey] = useState("");
  // const [enteredDecryptedKey, setEnteredDecryptedKey] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isConnected } = useAccount()
  const { connect, connectors } =
    useConnect()
  const { disconnect } = useDisconnect()
  const history = useHistory();
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  const {
    isInitialized,
    // isRegistered,
    register,
  } = useEERC(
    publicClient,
    !!walletClient && walletClient.data,
    EERCAddress,
    {
      transferURL: circuitURLs.transfer.wasm,
      multiWasmURL: circuitURLs.mint.wasm
    },
    circuitURLs,
    !!decryptedKey && decryptedKey
  );

  const connectWallet = () => connect({
    connector: connectors[0]
  })

  const registerWallet = async () => {
    try {
      setIsRegistering(true)
      if (!isInitialized) {
        toast.error("EERC not initialized")
      }
      const { key, transactionHash } = await register()
      if (!!key) {
        setDecryptedKey(key);
        toast.success("Wallet registered successfully")
      }
      console.log("key", key, "tx hash", transactionHash)
    } catch (error) {
      // console.error("Error registering wallet:", error);
      setIsRegistering(false)
      toast.error(error.message || "Error registering wallet. Please try again.");
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCopyKey = () => {
    if (decryptedKey) {
      navigator.clipboard.writeText(decryptedKey)
        .then(() => {
          toast.success('Key Copied'); // Show success toast
          history.push("/dashboard")
        })
        .catch(() => {
          toast.error('Failed to copy key'); // Show error toast if copying fails
        });
    }
  };

  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {/* Navbar */}
      <header className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white">WhisperPay</h1>
        {isConnected &&
          <button
            onClick={disconnect}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Disconnect Wallet
          </button>
        }
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-28 max-w-4xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-6">Private Group Payments. Reinvented.</h2>
        <p className="text-lg text-gray-300 mb-8">
          WhisperPay enables secure, anonymous, and efficient group-based financial coordination using Web3 wallets.
        </p>
        {isConnected ?
          <button
            onClick={() => {
              if (!!decryptedKey) {
                history.push("/dashboard")
              } else {
                setShowRegisterModal(true)
              }
            }}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-500 transition"
          >
            Launch App
          </button>
          :
          <button
            // onClick={() => open()}
            onClick={connectWallet}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-500 transition"
          >
            Connect To App
          </button>
        }
      </section>
      {!!decryptedKey && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-br from-gray-800/80 to-black/90 border border-gray-700 rounded-3xl p-8 max-w-md w-full shadow-xl text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent blur-xl opacity-20 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  {!!decryptedKey && (
                    <div className="flex flex-col gap-2">
                      <span>Decryption Key</span>
                      <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg">
                        <span className="text-sm text-gray-300 break-all">{decryptedKey}</span>
                        <button
                          onClick={handleCopyKey}
                          className="p-2 text-gray-400 hover:text-white transition"
                          title="Copy Key"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {(!!showRegisterModal && !decryptedKey) &&
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-br from-gray-800/80 to-black/90 border border-gray-700 rounded-3xl p-8 max-w-md w-full shadow-xl text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent blur-xl opacity-20 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <h2 className="text-2xl font-bold tracking-wide text-white">
                  You’re Not Registered
                </h2>
                <p className="text-sm mt-2 text-red-500 leading-relaxed">
                  After registration, you will be provided with a decrypted key, please copy and keep it safe.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white py-3 bg-gray-500 rounded-2xl shadow-lg transition-all"
                  >
                    Close
                  </button>

                  <button
                    onClick={registerWallet}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all"
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Processing..." : "Register Now"}
                  </button>

                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      }

      {/* Features Section */}
      <section className="bg-white text-gray-900 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <FaLock className="text-4xl mx-auto text-blue-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Private by Default</h3>
            <p className="text-gray-700">
              Your transactions are visible only to the group. Zero exposure, full privacy.
            </p>
          </div>
          <div>
            <FaUsers className="text-4xl mx-auto text-blue-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Built for Groups</h3>
            <p className="text-gray-700">
              WhisperPay makes it simple to coordinate contributions from any number of users.
            </p>
          </div>
          <div>
            <FaBolt className="text-4xl mx-auto text-blue-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Fast & Efficient</h3>
            <p className="text-gray-700">
              Powered by Avalanche C-Chain for lightning-fast, low-fee transactions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaLock size={40} className="mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Private Splitting</h3>
            <p className="text-gray-400">
              No one sees who paid or how much. Group balances remain encrypted and fair.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaBolt size={40} className="mx-auto text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Stealth Transfers</h3>
            <p className="text-gray-400">
              Each payment is routed through stealth addresses using eERC20's privacy tech.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FaUsers size={40} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">DAO-ready</h3>
            <p className="text-gray-400">
              Ideal for privacy in contributor payouts, multi-sig groups, and team grants.
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaMobileAlt size={40} className="mx-auto text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-400">
              Fully responsive design ensures seamless private payments from your phone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaShieldAlt size={40} className="mx-auto text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Security First</h3>
            <p className="text-gray-400">
              All transactions are encrypted end-to-end using eERC20 and Avalanche tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FaCogs size={40} className="mx-auto text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Automation</h3>
            <p className="text-gray-400">
              Automate recurring group payments with private, programmable logic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Callout Section */}
      <section className="py-20 px-6 text-center bg-blue-800">
        <h3 className="text-4xl font-extrabold mb-6">
          Pay Together. Stay Private.
        </h3>
        <p className="max-w-2xl mx-auto text-blue-200 text-lg mb-8">
          From roommates splitting rent to anonymous donations — WhisperPay gives you control of your group’s funds.
        </p>
        <button className="bg-white text-blue-900 px-8 py-3 text-lg rounded-lg font-semibold hover:bg-gray-100">
          Learn How It Works
        </button>
      </section>

      {/* Highlights Section */}
      <section className="bg-white text-blue-900 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-3xl font-bold mb-4">Why WhisperPay?</h4>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1" /> Anonymous peer-to-peer payments
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1" /> Create & manage multiple group wallets
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1" /> Zero sign-up, just connect wallet
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1" /> Social login supported via Web3Auth
              </li>
            </ul>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-2">Start Instantly</h4>
            <p className="text-gray-700 mb-4">
              No forms. No banks. Connect your wallet or login with social and create your first group in seconds.
            </p>
            <button
              onClick={connectWallet}
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-center py-6 text-sm text-gray-400">
        © {new Date().getFullYear()} WhisperPay. Built on Avalanche with ❤️.
      </footer>
    </div>
  );
}
