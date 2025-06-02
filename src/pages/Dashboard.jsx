import React, { useState, Fragment, useEffect } from "react";
import { FaUsers, FaMoneyBillWave, FaPlus, FaUserPlus, FaCopy, FaCoins } from "react-icons/fa";
import { motion } from "framer-motion";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatEther, formatUnits, toBigInt } from "ethers";
import { circuitURLs, EERCAddress, FactoryAddress, GroupFactoryABI } from '../utils';
// import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitNetworkCore } from '@reown/appkit/react';
import EventCountdownCalendar from "@/components/EventCountdownCalendar";
import { useEERC } from "@avalabs/ac-eerc-sdk"
import { usePublicClient, useWalletClient, useAccount, useContractWrite, useDisconnect, useContractRead } from 'wagmi'



export default function Dashboard() {
  const history = useHistory();
  // const { open } = useAppKit();
  // AppKit hook to get the chain id
  // const { chainId } = useAppKitNetworkCore();
  // AppKit hook to get the wallet provider
  // const { walletProvider } = useAppKitProvider("eip155");

  // const { address, isConnected } = useAppKitAccount();
  const { address, isConnected } = useAccount()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [decryptedKey, setDecryptedKey] = useState("");
  const [enteredDecryptedKey, setEnteredDecryptedKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [endDate, setEndDate] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(0);
  const { disconnect } = useDisconnect()

  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  const {
    isRegistered,
    symbol,
    decimals,
    useEncryptedBalance,
  } = useEERC(
    publicClient,
    walletClient.data,
    EERCAddress,
    {
      transferURL: circuitURLs.transfer.wasm,
      multiWasmURL: circuitURLs.mint.wasm
    },
    circuitURLs,
    !!decryptedKey && decryptedKey
  );
  const { decryptedBalance, parsedDecryptedBalance, privateTransfer } = useEncryptedBalance();
  console.log("parse balance", parsedDecryptedBalance)

  const { data: allGroups, isFetched, refetch: refetchGroups } = useContractRead({
    abi: GroupFactoryABI,
    address: FactoryAddress,
    functionName: "getAllGroups",
  })

  const { writeAsync: createGroup } = useContractWrite({
    address: FactoryAddress,
    abi: GroupFactoryABI,
    functionName: 'createGroup',
  })

  const handleCreateGroup = async () => {
    try {
      setIsLoading(true);

      // Input validation
      if (groupName === "") {
        toast.error("Group name is required");
        return;
      }
      if (targetAmount <= 0) {
        toast.error("Target amount must be greater than 0");
        return;
      }
      if (groupDescription === "") {
        toast.error("Group description is required");
        return;
      }

      // Check wallet connection
      if (!isRegistered) {
        toast.error("Please connect your wallet first");
        // open(); // Open AppKit wallet connection modal
      }

      // Convert target amount to wei (assuming 18 decimals)
      // const targetAmountC = Number(formatUnits(targetAmount.toString(), 2));

      // Calculate end date (30 days from now)
      let _endDate;
      if (endDate) {
        _endDate = Math.floor(new Date(endDate).getTime() / 1000);
      }

      // Show pending toast
      const pendingToast = toast.loading("Creating group...");

      // Create group transaction
      const { hash } = await createGroup({
        args: [
          groupName,
          groupDescription,
          targetAmount,
          _endDate
        ],
        from: address
      })

      // Dismiss pending toast
      if (!!hash) {
        toast.dismiss(pendingToast);
        toast.success("Group created successfully!");
        const { isFetched, data } = await refetchGroups()
        if (!!isFetched) {
          setGroups(data)
        }
        // console.log(
        //   "---refetching---",
        //   "is fetched", isFetched,
        //   "data", data,
        // )
      }

      // Reset form and close modal
      setIsModalOpen(false);
      setGroupName("");
      setTargetAmount(0);
      setGroupDescription("");

    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.message || "Error creating group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const contributeToGroup = async () => {
    if (contributionAmount <= 0) {
      toast.error("Contribution amount must be greater than 0");
      return;
    }
    try {
      setIsContributing(true)
      // console.log("contributionAmount", contributionAmount);
      // const signer = getSigner();
      // const factoryContract = new Contract(FactoryAddress, GroupFactoryABI, signer);
      const groupOwner = selectedGroup["owner"]
      // console.log(
      //   "owner", groupOwner,
      //   "contributionAmount bigint", toBigInt(contributionAmount),
      // )
      //add logic to handle private transfer
      const { transactionHash, receiverEncryptedAmount, senderEncryptedAmount } = await privateTransfer(groupOwner, toBigInt(contributionAmount * 100))
      // console.log(
      //   "tx hash", transactionHash,
      //   "receiverEncryptedAmount", receiverEncryptedAmount,
      //   "senderEncryptedAmount", senderEncryptedAmount,
      // )
      if (!!transactionHash) {
        toast.success("Contribution successful!");
        setIsContributing(false);
        setContributionAmount(0);
        setSelectedGroup(null)
      }
    } catch (error) {
      // console.error("Error contributing to group:", error);
      toast.error(error.message || "Error contributing to group. Please try again.");
      setIsContributing(false);
    }
  }

  useEffect(() => {
    const fetchGroups = async () => {
      if (isFetched) {
        console.log("all groups", allGroups, "success", isFetched)
        setGroups(allGroups);
      }
    };

    fetchGroups();
  }, []);


  return (
    <div className="bg-black px-20 py-">
      <header className="flex justify-between py-6 items-center mx-auto">
        <h1 onClick={() => history.push("/")} className="text-2xl cursor-pointer font-bold text-white">WhisperPay</h1>
        {isConnected &&
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-md flex gap-2 items-center justify-center"
              >
                <p className="text-xl font-bold text-white">
                  {!!parsedDecryptedBalance ? formatUnits(parsedDecryptedBalance, 2) : 0} <span className="text-white text-sm">WHISP</span>
                </p>
                <FaCoins className="text-lg text-yellow-400" />
              </motion.div>
            </div>


            <button
              onClick={() => {
                disconnect()
                history.push("/")
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Disconnect Wallet
            </button>
          </div>
        }
      </header>
      {!!decryptedKey &&
        <div className="min-h-screen my-10 bg-gray-950 text-white">
          <div className="w-full flex justify-between">
            <header className="text-xl font-bold text-center">Groups</header>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-semibold px-4 py-2 rounded-md text-sm hover:from-indigo-700 hover:to-purple-600 transition">
              <span>Create Group</span>
              <FaPlus />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 my-20 mx-auto">
            {groups.length > 0 ? groups.map((group, index) => (
              <motion.div
                key={group.uniqueId}
                className="relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black p-6 rounded-3xl border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group"
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300 pointer-events-none"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold tracking-tight text-white mb-6">
                    #{Number(group.uniqueId).toString().padStart(3, '0')} &mdash; {group.name}
                  </h3>

                  <div className="space-y-4 text-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light tracking-wide text-gray-400">Target</span>
                      <span className="flex items-center font-semibold text-emerald-400 text-lg">
                        <FaMoneyBillWave className="mr-2 text-emerald-500" />
                        {Number(group.targetAmount).toFixed(2)} {symbol}
                      </span>
                    </div>
                    {
                      address === group["owner"] && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-light tracking-wide text-gray-400">Contributions</span>
                          <span className="flex items-center font-semibold text-emerald-300 text-lg">
                            <FaMoneyBillWave className="mr-2 text-emerald-400" />
                            {!!parsedDecryptedBalance && formatUnits(parsedDecryptedBalance, 2)} {symbol}
                          </span>
                        </div>
                      )
                    }
                  </div>

                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="mt-8 w-full py-3 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-semibold text-lg shadow-md hover:shadow-xl hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 focus:outline-none"
                  >
                    Contribute
                  </button>
                </div>
              </motion.div>

            )) : (
              <div className="text-start text-2xl text-gray-400">
                No groups found
              </div>
            )}
          </div>
        </div>
      }

      {!decryptedKey && (
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
            {/* Glow Layer */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent blur-xl opacity-20 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 space-y-6">
              <h2 className="text-2xl font-bold tracking-wide text-white">
                Please input your decryption key
              </h2>
              {/* <p className="text-sm text-gray-300 leading-relaxed">
                    You need to be registered before participating. Click the button below to begin registration.
                  </p> */}
              <p className="text-sm mt-2 text-red-500 leading-relaxed">
                Please ensure you have the correct decryption key, as this will be used to decrypt your group balance
              </p>

              <div>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Decryption Key"
                  value={enteredDecryptedKey}
                  onChange={(e) => setEnteredDecryptedKey(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => history.push("/")}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white py-3 bg-gray-500 rounded-2xl shadow-lg transition-all"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setDecryptedKey(enteredDecryptedKey);
                    toast.success("Decryption key set!")
                  }}
                  className="w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all"
                >
                  Save
                </button>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal */}
      <Dialog
        open={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-70 backdrop-blur-sm"
      >
        {selectedGroup && (
          <DialogPanel className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white p-8 rounded-3xl max-w-2xl w-full border border-gray-700 shadow-2xl">
            <div className="flex flex-col md:flex-row md:space-x-10">
              {/* Left section: Info */}
              <div className="flex-1 space-y-6">
                <DialogTitle className="text-3xl font-extrabold tracking-wide">{selectedGroup.name}</DialogTitle>
                <p className="text-gray-400 text-lg leading-relaxed">{selectedGroup.description}</p>

                <div className="grid grid-cols-2 gap-6 text-sm text-gray-300">
                  <div>
                    <span className="font-semibold text-white block mb-1">Total Amount</span>
                    <span className="text-xl font-mono">{Number(selectedGroup.targetAmount).toFixed(2)}</span>
                  </div>
                  {
                    address == selectedGroup["owner"] && (
                      <div>
                        <span className="font-semibold text-white block mb-1">Contributions</span>

                        {/* using eerc useEncryptedBalance hook, get the balance of the group */}
                        <span className="text-xl font-mono">{!!parsedDecryptedBalance && Number(formatUnits(parsedDecryptedBalance, 2)).toFixed(2)}</span>
                      </div>
                    )
                  }
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 rounded mx-8" />

              {/* Right section: Countdown + calendar */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                <EventCountdownCalendar endDate={new Date(Number(selectedGroup.endDate) * 1000)} />
              </div>
            </div>

            <div className="my-4">
              <label
                htmlFor="contributionAmount"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Contribution Amount
              </label>
              <input
                type="number"
                id="targetAmount"
                className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Contribution Amount"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
              />
            </div>

            <div className="flex gap-4">

              {/* Close button */}
              <button
                className="w-full py-3 bg-gray-700 rounded-2xl text-white font-semibold text-lg hover:bg-gray-600 transition-shadow shadow-lg"
                onClick={() => setSelectedGroup(null)}
              >
                Close
              </button>

              <button
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-shadow shadow-lg"
                onClick={() => contributeToGroup()}
              >
                {isContributing ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : ('Contribute')}
              </button>

            </div>
          </DialogPanel>
        )}
      </Dialog>


      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsModalOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-8 text-left align-middle shadow-2xl transition-all">
                  <DialogTitle className="text-2xl font-extrabold text-white mb-2">
                    Create New Group
                  </DialogTitle>

                  <p className="text-red-500 text-sm mb-6 font-medium leading-relaxed">
                    Please provide contributors with the unique group ID displayed after creation to avoid conflicts with similar group names.
                  </p>

                  {/* Group Name */}
                  <div className="mb-5">
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      Group Name
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Group Name"
                      value={groupName}
                      maxLength={20}
                      onChange={(e) => {
                        const words = e.target.value.trim().split(/\s+/);
                        if (words.length <= 20) {
                          setGroupName(e.target.value);
                        } else {
                          toast.error('Maximum 20 words allowed');
                        }
                      }}
                    />
                  </div>

                  {/* Target Amount */}
                  <div className="mb-5">
                    <label
                      htmlFor="targetAmount"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      Target Amount
                    </label>
                    <input
                      type="number"
                      id="targetAmount"
                      className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Target Amount"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>

                  {/* End Date */}
                  <div className="mb-5">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      Intended Date for Event
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="End Date - default is 30 days from now"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {/* Group Description */}
                  <div className="mb-8">
                    <label
                      htmlFor="groupDescription"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      Group Description
                    </label>
                    <textarea
                      id="groupDescription"
                      rows={4}
                      maxLength={200}
                      className="w-full rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      placeholder="Group Description"
                      value={groupDescription}
                      onChange={(e) => {
                        const words = e.target.value.trim().split(/\s+/);
                        if (words.length <= 200) {
                          setGroupDescription(e.target.value);
                        } else {
                          toast.error('Maximum 150 words allowed');
                        }
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4">
                    <button
                      disabled={isLoading}
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl bg-gray-700 px-5 py-2 text-gray-300 hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={handleCreateGroup}
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 font-semibold text-white hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:bg-gray-500 transition"
                    >
                      {isLoading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
}
