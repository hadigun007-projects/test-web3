# Vue.js Web3 & Crypto Dashboard

This project is a Vue.js application that allows users to connect their MetaMask wallet, view wallet balance, and fetch top 5 cryptocurrency data from CoinGecko.

This app created for skill fest for Fullstack Position.

## Features
- Connect & Disconnect MetaMask Wallet
- Display Wallet Address & Balance
- Detect Wallet Address Change
- Fetch Top 5 Cryptocurrencies from CoinGecko API

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/hadigun007-projects/test-web3.git
cd test-web3
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Run the Development Server
```sh
npm run dev
```

## Usage

### Connect Wallet
1. Click **"Connect Wallet"**
2. Grant permission in MetaMask
3. Your wallet address and balance will be displayed

### Disconnect Wallet
- Click **"Disconnect Wallet"** (MetaMask must be manually disconnected in the extension for full logout)

### Fetch Crypto Data
- The app automatically fetches the **top 5 cryptocurrencies** from CoinGecko.

## Deployment
To deploy, build the project:
```sh
npm run build
```
Then, deploy the `/dist` folder to your hosting provider.

## Technologies Used
- Vue.js 3
- ethers.js
- MetaMask
- CoinGecko API

## License
This project is open source under the [MIT License](LICENSE).

## Authors
[hadigun007](https://github.com/hadigun007)


