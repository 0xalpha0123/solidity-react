# Solidity React Storage

This project is made of a simple solidity contract (set/get a number) and a web interface to call functions on it.

I've used [the Truffle framework](https://www.trufflesuite.com/) for everything related to the smart contract: create the environment, set up the testnet with [Ganache](https://www.trufflesuite.com/ganache), compile and deploy the contract.

The frontend is made with React, using [the box](https://github.com/truffle-box/react-box) provided by Truffle along with Create React App, and [Web3](https://github.com/ethereum/web3.js) to interact with the ethereum network client-side.

Finally, [Metamask](https://metamask.io/) is needed to actually accept/reject transactions to the network

## Install

Prerequisites:
- NodeJS >= 10
- Metamask

Clone the repo, then run:

```bash
$ cd solidity-react-storage
$ npm i -g truffle # this is needed globally, since you'll use the console for working with the contract
$ npm install # install utility packages
$ cd client
$ npm install # setup the frontend
```

## Usage

Let's start working on the contract in a local environment. Run:

```bash
$ truffle develop
```

This will start a local blockchain, with a wallet for you, and some accounts ready to be used! So, **while you are in the truffle console**, run these commands:

```bash
truffle(develop)> compile
truffle(develop)> migrate
```

The **final step** is to start the frontend. So, open up another terminal, and run:

```bash
$ cd solidity-react-storage/client
$ npm run start
```

This will start a local dev server using the `3000` port, and there you can play with the web interface, set a new value for the contract, and read its new value.

## Deploy to Ropsten

**Don't use the same wallet you used for local development!** If you want go from ropsten back to local development, you'll get weird errors about nonce mismatches, linked to Metamask caching. Save you some headaches by using a different wallet when using ropsten

Copy `.env.example` to `.env`, and set the appropriate env variables. You will need the mnemonic for a wallet, and then an [Infura](https://infura.io) API key to interact with the network. Then start the truffle console with `truffle develop`, and run these commands:

```bash
truffle(develop)> compile
truffle(develop)> migrate --network ropsten
```

Now the contract has been deployed to ropsten, so switch the network inside Metamask, and you're done!
