import React, { useState, Fragment } from "react";
import { FaUsers, FaMoneyBillWave, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";

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

export default function Dashboard() {
  const history = useHistory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleCreateGroup = () => {
    try {
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
      console.log("Creating new group:", groupName);
      setIsModalOpen(false);
      setGroupName("");
      setTargetAmount(0);
      setGroupDescription("");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group. Please try again.");
    }
    
  };

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
          {dummyGroups.map((group) => (
            <motion.div
              key={group.id}
              className="bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-800 hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <div className="flex items-center text-gray-300 mb-2">
                <FaMoneyBillWave className="mr-2 text-green-400" /> {group.totalAmount}
              </div>
              <div className="flex items-center text-gray-300 mb-4">
                <FaUsers className="mr-2 text-blue-400" /> {group.contributors} Contributors
              </div>
              <button
                onClick={() => setSelectedGroup(group)}
                className="bg-blue-600 px-4 py-2 rounded-xl text-sm hover:bg-blue-500 transition"
              >
                Contribute
              </button>
            </motion.div>
          ))}
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
                  
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Create New Group
                  </Dialog.Title>

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
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateGroup}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
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
