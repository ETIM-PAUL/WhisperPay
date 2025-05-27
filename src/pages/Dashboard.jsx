import React, { useState, Fragment, useEffect } from "react";
import { FaUsers, FaMoneyBillWave, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BrowserProvider, Contract, parseEther, formatEther } from "ethers";
import { FactoryAddress, GroupFactoryABI } from '../utils';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

const dummyGroups = [
  {
    id: 1,
    name: "Team Alpha Budget",
    totalAmount: "2,400 USDC",
    contributors: 12,
    description: "Monthly contributions for the Alpha team's recurring expenses, tools, and perks. All transactions are private.",
  },
  {
    id: 2,
    name: "DAO Ops Pool",
    totalAmount: "9,120 USDC",
    contributors: 33,
    description: "Private contributor rewards pool managed anonymously through the DAO treasury using eERC20.",
  },
  {
    id: 3,
    name: "Marketing Launch Fund",
    totalAmount: "4,750 USDC",
    contributors: 18,
    description: "A stealth campaign fund for launching WhisperPay campaigns anonymously across channels.",
  },
];

const FUJI_RPC = "https://avalanche-fuji.drpc.org";

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
      let _endDate = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
      if (endDate) {
        _endDate = Math.floor(new Date(endDate).getTime() / 1000);
      }
      console.log("signer", signer);
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
        endDate
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


  useEffect(() => {
    const fetchGroups = async () => {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const factoryContract = new Contract(FactoryAddress, GroupFactoryABI, signer);  

      const groups = await factoryContract.getAllGroups();
      console.log("groups", groups);
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
                className="bg-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-500 transition"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
        >
          {selectedGroup && (
            <Dialog.Panel className="bg-gray-900 text-white p-6 rounded-2xl max-w-md w-full border border-gray-800 shadow-lg">
              <Dialog.Title className="text-xl font-bold mb-4">{selectedGroup.name}</Dialog.Title>
              <p className="text-gray-400 mb-4">{selectedGroup.description}</p>
              <div className="text-sm text-gray-300 space-y-2">
                <div>
                  <span className="font-medium text-white">Total Amount:</span> {selectedGroup.totalAmount}
                </div>
                <div>
                  <span className="font-medium text-white">Contributors:</span> {selectedGroup.contributors}
                </div>
              </div>
              <button
                className="mt-6 bg-blue-600 w-full py-2 rounded-xl text-sm hover:bg-blue-500 transition"
                onClick={() => setSelectedGroup(null)}
              >
                Close
              </button>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  
                  <Dialog.Title className="font-medium text-gray-900">
                    <span className="text-black text-lg">Create New Group</span>
                  </Dialog.Title>
                    <span className="text-red-500 text-sm">Please provide contributors with group unique ID display after group is created, to avoid conflicts with similar group names</span>

                  <div className="mt-4">
                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                    <input
                      type="text"
                      id="groupName"
                      className="w-full p-3 border rounded-lg text-gray-900"
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


                  <div className="mt-4">
                    <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                    <input
                      type="number"
                      id="targetAmount"
                      className="w-full p-3 border rounded-lg text-gray-900"
                      placeholder="Target Amount"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Intended Date for Event</label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      className="w-full p-3 border rounded-lg text-gray-900"
                      placeholder="End Date - default is 30 days from now"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-2">Group Description</label>
                    <textarea
                      id="groupDescription"
                      className="w-full p-3 border rounded-lg text-gray-900"
                      placeholder="Group Description"
                      value={groupDescription}
                      rows={3}
                      maxLength={200}
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

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      disabled={isLoading}
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={handleCreateGroup}
                      className="bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg hover:bg-blue-500"
                    >
                      Create
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
