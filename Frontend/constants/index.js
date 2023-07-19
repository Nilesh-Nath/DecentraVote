const contractAddress = require("./contractAddress.json");
const abi = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "interval", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "campaignState", type: "uint256" },
      { internalType: "uint256", name: "candidateNumber", type: "uint256" },
    ],
    name: "DecentraVote__UpKeepNotNeeded",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "name", type: "string" },
      {
        indexed: true,
        internalType: "address",
        name: "candidateAddress",
        type: "address",
      },
    ],
    name: "candidateAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "winnerName",
        type: "string",
      },
    ],
    name: "gotWinner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "candidate",
        type: "address",
      },
    ],
    name: "voted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
    ],
    name: "voterRegistered",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "address", name: "candidateAddress", type: "address" },
      { internalType: "string", name: "_candidateImage", type: "string" },
      { internalType: "string", name: "_partyName", type: "string" },
    ],
    name: "addCandidates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    name: "checkUpkeep",
    outputs: [
      { internalType: "bool", name: "upkeepNeeded", type: "bool" },
      { internalType: "bytes", name: "", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCampaignName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCampaignState",
    outputs: [
      {
        internalType: "enum DecentraVote.campaignStates",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCondidates",
    outputs: [
      {
        components: [
          { internalType: "string", name: "candidateName", type: "string" },
          {
            internalType: "address",
            name: "candidateAddress",
            type: "address",
          },
          { internalType: "uint256", name: "voteCount", type: "uint256" },
          { internalType: "string", name: "candidateImage", type: "string" },
          { internalType: "string", name: "partyName", type: "string" },
        ],
        internalType: "struct DecentraVote.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "voter", type: "address" }],
    name: "getEligibility",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHighestVote",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInitialTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInterval",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalVotes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "voter", type: "address" }],
    name: "getVotedTo",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinnerCandidate",
    outputs: [
      {
        components: [
          { internalType: "string", name: "candidateName", type: "string" },
          {
            internalType: "address",
            name: "candidateAddress",
            type: "address",
          },
          { internalType: "uint256", name: "voteCount", type: "uint256" },
          { internalType: "string", name: "candidateImage", type: "string" },
          { internalType: "string", name: "partyName", type: "string" },
        ],
        internalType: "struct DecentraVote.Winner",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "openCampaign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_age", type: "uint256" },
      { internalType: "string", name: "nationality", type: "string" },
    ],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "candidate", type: "address" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "winnerInfo",
    outputs: [
      { internalType: "string", name: "candidateName", type: "string" },
      { internalType: "address", name: "candidateAddress", type: "address" },
      { internalType: "uint256", name: "voteCount", type: "uint256" },
      { internalType: "string", name: "candidateImage", type: "string" },
      { internalType: "string", name: "partyName", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

module.exports = {
  abi,
  contractAddress,
};
