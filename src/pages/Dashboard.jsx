import React, { useState, Fragment, useEffect } from "react";
import { FaUsers, FaMoneyBillWave, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { FactoryAddress, GroupFactoryABI } from '../utils';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import EventCountdownCalendar from "@/components/EventCountdownCalendar";


export default function Dashboard() {
  const history = useHistory();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider("eip155");
  const { address, isConnected } = useAppKitAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [endDate, setEndDate] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(0);
  
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
      if (!isConnected || !address) {
        toast.error("Please connect your wallet first");
        open(); // Open AppKit wallet connection modal
        return;
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner()

      // Convert target amount to wei (assuming 18 decimals)
      const targetAmountWei = parseEther(targetAmount.toString());
      
      // Calculate end date (30 days from now)
      let _endDate;
      if (endDate) {
        _endDate = Math.floor(new Date(endDate).getTime() / 1000);
      }

      // Create contract instance
      const factoryContract = new Contract(
        FactoryAddress,
        GroupFactoryABI,
        signer
      );

      // Show pending toast
      const pendingToast = toast.loading("Creating group...");

      // Create group transaction
      const tx = await factoryContract.createGroup(
        groupName,
        groupDescription,
        targetAmountWei,
        _endDate
      );

      // Wait for transaction confirmation
      await tx.wait();

      // Dismiss pending toast
      toast.dismiss(pendingToast);
      toast.success("Group created successfully!");

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
      console.log("contributionAmount", contributionAmount);
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const factoryContract = new Contract(FactoryAddress, GroupFactoryABI, signer);

      //add logic to handle private transfer

      toast.success("Contribution successful!");
    } catch (error) {
      console.error("Error contributing to group:", error);
      toast.error(error.message || "Error contributing to group. Please try again.");
    }
  }

  useEffect(() => {
    const fetchGroups = async () => {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const factoryContract = new Contract(FactoryAddress, GroupFactoryABI, signer);  

      const groups = await factoryContract.getAllGroups();
      setGroups(groups);
    };

    fetchGroups();
  }, [walletProvider]);


  return (
    <div className="bg-black px-20 py-">
      <header className="flex justify-between py-6 items-center mx-auto">
        <h1 onClick={()=>history.push("/")} className="text-2xl cursor-pointer font-bold text-white">WhisperPay</h1>
        <div className="flex gap-4">
          <appkit-button />
        </div>
      </header>

      <div className="min-h-screen my-10 bg-gray-950 text-white">
        <div className="w-full flex justify-between">
          <header className="text-xl font-bold text-center">Groups</header>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-500 transition">
            <span>Create</span>
            <FaPlus/>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 my-20 mx-auto">
          {groups.length > 0 ? groups.map((group,index) => (
            <motion.div
              key={group.uniqueId}
              className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2">{Number(group.uniqueId).toString().padStart(3, '0')} - {group.name}</h3>
              <div className="flex items-center text-gray-300 mb-2 gap-3">
                <span>Target: </span>
                <span className="flex items-center">
                  <FaMoneyBillWave className="mr-1 text-green-400" /> {Number(formatEther(group.targetAmount)).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center text-gray-300 mb-4 gap-3">
                <span>Contribution: </span>

                {/* Please add logic to fetch each contract balance */}
                <span className="flex items-center">
                  <FaMoneyBillWave className="mr-1 text-green-400" /> {300.00}
                </span>
              </div>
              <button
                onClick={() => setSelectedGroup(group)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-shadow shadow-lg"
              >
                Contribute
              </button>
            </motion.div>
          )) : (
            <div className="text-start text-2xl text-gray-400">
              No groups found
            </div>
          )}
        </div>

        {/* Modal */}
        <Dialog
          open={!!selectedGroup}
          onClose={() => setSelectedGroup(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black bg-opacity-70 backdrop-blur-sm"
           >
          {selectedGroup && (
            <Dialog.Panel className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white p-8 rounded-3xl max-w-2xl w-full border border-gray-700 shadow-2xl">
              <div className="flex flex-col md:flex-row md:space-x-10">
                {/* Left section: Info */}
                <div className="flex-1 space-y-6">
                  <Dialog.Title className="text-3xl font-extrabold tracking-wide">{selectedGroup.name}</Dialog.Title>
                  <p className="text-gray-400 text-lg leading-relaxed">{selectedGroup.description}</p>

                  <div className="grid grid-cols-2 gap-6 text-sm text-gray-300">
                    <div>
                      <span className="font-semibold text-white block mb-1">Total Amount</span>
                      <span className="text-xl font-mono">{Number(formatEther(selectedGroup.targetAmount)).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-white block mb-1">Contributions</span>

                      {/* using eerc useEncryptedBalance hook, get the balance of the group */}
                      <span className="text-xl font-mono">300.00</span>
                    </div>
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
                  Contribute
                </button>

              </div>
            </Dialog.Panel>
          )}
        </Dialog>


        <Transition.Root show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setIsModalOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-6 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 p-8 text-left align-middle shadow-2xl transition-all">
                    <Dialog.Title className="text-2xl font-extrabold text-white mb-2">
                      Create New Group
                    </Dialog.Title>

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
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

      </div>

    </div>
  );
}
