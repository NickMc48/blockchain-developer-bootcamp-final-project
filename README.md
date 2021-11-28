# Discrepancy Report Manager
My final project proposal is a Discrepancy Report (DR) Managementn System run by smart a contract on a blockchain.

In a truly fielded version, this would be on a chain with priviliged access as items with a DR against them are likely at least Critical Unclassified Information.

A typical work flow should proceed as follows:
1) Any SUBMITTER may open a DR against an item controlled by a CONTENT OWNER in the form of a smart contract submission.
2) The CONTENT OWNER of the item will then mark the DR as 'Accepted' if the DR is valid or 'Declined' if invalid.
   1) Accepted: The OWNER will mark the DR as 'Resolved' and will then notify the SUBMITTER.
      1) The SUBMITTER will then accept or decline the resolution by marking the DR as 'Fixed' or 'Rejected' respectively via smart contract function. If the resolution is 'Rejected', the CONTENT OWNER will then be able to make the appropriate changes and change the state to 'Resolved' again for re-submission to the SUBMITTER.
   2) Declined: SUBMITTER can then be notified the DR they have submitted is invalid per the   CONTENT OWNER.

## Folder Structure
build/contracts
   Contains .json files from which the ABI is pulled.
contracts
   Contains the Discrepancy Report Manager contract as well as the standard migration contract.
migrations
   Contains Javascript files detailing how to deploy selected contracts.
test
   Contains files required to run all local tests for this project.


## Public Ethereum Account for NFT
```
0x881B7cF77e36BF15164FBD35be71B174FD2621bE
```

## Front-end location
This was developed using HTML and Javascript (I am sure it wil be ovbious, but this is my first web 'app', sorry.)
```
URL: http://NickMc48.github.io
Repository: https://github.com/NickMc48/NickMc48.github.io
```

## Contract Location
The contract is located on the Rinkeby test network at address:
```
0x9Ff7f6d8D8b1Cd70669c11a9D17E327F8268b61D
```

## Installing Dependencies
Run the following commands to install dependencies needed for this project:

Install MetaMask in your browser: [MetaMask.io](https://metamask.io/download.html)

Install Node.js: [Nodejs.org](https://nodejs.org/en/download/package-manager/)

Then install each of the following:

```
npm install -g npm
```

```
npm install -g solc@0.8.10
```

```
npm install @openzeppelin/contracts
```

```
npm install -g truffle
```
```
npm install -g ganache-cli
```
```
npm install  @truffle/hdwallet-provider
```

```
npm install dotenv
```

## Unit Testing Procedure
The unit tests are contained in the file at: *./test/discrepancy_report_manager.test.js*

In '*truffle-config.js*', set the **Development** port to **9545**:
```
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 9545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
 ...
```

Set the exact compiler version to **0.8.10** as specified in the contract:
```
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10", 
    }
  },
```
From the project root folder, run:
```
truffle develop
```

Then run:
```
test --network development
```

## Final Project Walk-through Recording
A recording of my final walkthrough will be here: 