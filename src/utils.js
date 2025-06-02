export const aquaSubnet = {
    id: 61709,
    name: 'Stingy Aqua',
    nativeCurrency: {
        decimals: 2,
        name: 'AQUA',
        symbol: 'AQUA',
    },
    rpcUrls: {
        default: { http: ['https://subnets.avax.network/stingyaqua/testnet/rpc'] },
    },
    blockExplorers: {
        default: {
            name: 'StingyAqua Explorer',
            url: 'https://subnets-test.avax.network/stingyaqua',
        },
    },
    contracts: {
        whisperEERC: {
            address: '0xea026789aba4b696543ceade780ce02993076832',
            blockCreated: 21,
        },
    },
}

export const FactoryAddress = "0x271f063684Ed7e903D45829a2616dfbB38189c5B";
export const EERCAddress = "0xea026789aba4b696543ceade780ce02993076832";
// export const FactoryAddress = "0x0807840D99a4d6077bd3544C0Dd957735Bfc8AdF";

export const GroupFactoryABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "groupAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "groupId",
                "type": "uint256"
            }
        ],
        "name": "GroupCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allGroups",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "uniqueId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "groupAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_targetAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endDate",
                "type": "uint256"
            }
        ],
        "name": "createGroup",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllGroups",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "targetAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "uniqueId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "groupAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct GroupFactory.GroupDetails[]",
                "name": "_allGroups",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "groupCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export const GroupABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_targetAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_uniqueId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_createdAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "createdAt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "description",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endDate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGroupInfo",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "targetAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "uniqueId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export const circuitURLs = {
    register: {
        wasm: "/wasm/registration/registration.wasm",
        zkey: "/wasm/registration/circuit_final.zkey",
    },
    transfer: {
        wasm: "/wasm/transfer/transfer.wasm",
        zkey: "/wasm/transfer/transfer.zkey",
    },
    mint: {
        wasm: "/wasm/mint/mint.wasm",
        zkey: "/wasm/mint/mint.zkey",
    },
    burn: {
        wasm: "/wasm/burn/burn.wasm",
        zkey: "/wasm/burn/burn.zkey",
    },
    withdraw: {
        wasm: "/wasm/withdraw/withdraw.wasm",
        zkey: "/wasm/withdraw/circuit_final.zkey",
    },
}