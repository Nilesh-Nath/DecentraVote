# DecentraVote - Blockchain Voting Platform

Welcome to DecentraVote, a blockchain-based voting platform that aims to revolutionize the way elections are conducted by leveraging the power of blockchain technology. Below, you'll find all the essential information to understand and use our platform efficiently.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
3. [Features](#features)
   - [Adding Candidates](#adding-candidates)
   - [Voter Registration](#voter-registration)
   - [Voting](#voting)
   - [Campaign Reopening](#campaign-reopening)
4. [Advantages of Voting in Blockchain](#advantages-of-voting-in-blockchain)
5. [Frontend](#frontend)
6. [Contributing](#contributing)
7. [License](#license)

## Introduction

DecentraVote is a decentralized voting platform built on the Ethereum blockchain. It uses smart contracts written in Solidity and deploys them using the Hardhat environment with JavaScript. The platform allows authorized individuals (contract owners) to add candidates to the campaign based on specific criteria. Once candidates are added, eligible voters can register and cast their votes securely on the blockchain. Chainlink keepers trigger the winner selection process after the campaign's end, ensuring a transparent and fair voting outcome.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- Hardhat environment set up with Hardhat deployment scripts.
- Chainlink keepers integrated into the environment.

### Installation

1. Clone the DecentraVote repository.

   https://github.com/Nilesh-Nath/DecentraVote.git

2. Install the required dependencies.

cd DecentraVote
yarn install

### Run Frontend

cd Frontend
yarn run dev

## Features

### Adding Candidates

Only authorized individuals (contract owners) can add candidates to the campaign. They must meet specific requirements, such as age and nationality constraints. Additional constraints can be easily added as needed.

Note : \*\* Only the deployer of the contract (i.e. Owner of the contract) have permission for this function.

### Voter Registration

Eligible voters can register for the campaign by interacting with the smart contract. Once registered, they can cast their votes for their desired candidates. Each voter can register and vote only once.

### Voting

Registered voters can cast their votes securely on the blockchain for the candidates they support. The voting process is tamper-proof and transparent, ensuring the integrity of the election.

### Campaign Reopening

Only the contract owner has the right to reopen the campaign. When reopened, the current time gets initialized as the start time of the new campaign. The contract keeps track of voters from the previous campaign, resetting their eligibility to vote in the new campaign.

Note : \*\* Only the deployer of the contract (i.e. Owner of the contract) have permission for this function.

## Advantages of Voting in Blockchain

1. **Transparency and Immutability**: All voting data is recorded on the blockchain, making it transparent and tamper-proof. Once votes are cast, they cannot be altered, ensuring the integrity of the election.

2. **Security and Fraud Prevention**: Blockchain's cryptographic features make voting secure and significantly reduce the risk of fraudulent activities, protecting the democratic process.

3. **Decentralization and Elimination of Intermediaries**: Decentralized nature removes the need for intermediaries, reducing the possibility of biases or corruption.

4. **Real-time Results and Improved Efficiency**: Vote counting is automated and provides real-time results, making the election process more efficient and less time-consuming.

5. **Enhanced Privacy**: Voter identities are encrypted on the blockchain, providing a level of anonymity not always possible in traditional voting systems.

6. **Reduced Costs**: Implementing a blockchain-based voting system may require some initial investment, but it can lead to cost savings in the long run by reducing manual processes and paperwork.

## Frontend

The frontend of DecentraVote is developed using Next.js. It utilizes Web3UiKit for some UI components and useWeb3Contract to interact with the smart contract functions. Axios is used to upload candidate images to Pinata, an IPFS pinning service. By storing only the image URI on the blockchain, the platform reduces gas expenses.

---
