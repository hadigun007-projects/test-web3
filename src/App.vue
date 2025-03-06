<script setup lang="ts">
import { ethers } from "ethers";
import { ref, onMounted } from "vue";
const selectedProvider = ref(null);
const account = ref(null);
const balance = ref(null);
const cryptos = ref([]);

const connectMetaMask = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      return { account: accounts[0], provider, signer };
    } catch (error) {
      console.error("User denied account access", error);
      return null;
    }
  } else {
    console.error("MetaMask not installed");
    return null;
  }
};

const getWalletBalance = async (provider, address) => {
  if (!provider || !address) {
    console.error("Provider or address is missing.");
    return null;
  }

  try {
    const balanceWei = await provider.getBalance(address);
    return ethers.formatEther(balanceWei); // Convert Wei to ETH
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

const connectWallet = async () => {
  const connection = await connectMetaMask();

  if (connection) {
    selectedProvider.value = connection.provider; // Assign provider
    account.value = connection.account; // Assign connected account

    balance.value = await getWalletBalance(connection.provider, connection.account); // Fetch balance
  }
};

const handleAccountChange = async (accounts) => {
  if (accounts.length > 0) {
    console.log("Switched account:", accounts[0]);
    account.value = accounts[0];
    balance.value = await getWalletBalance(selectedProvider.value, accounts[0]);
  } else {
    disconnectWallet();
  }
};


onMounted(async () => {
  await fetchCryptoData();
  await connectMetaMask();
  if (window.ethereum) {
    try {
      window.ethereum.on("accountsChanged", handleAccountChange);
      const accounts = await window.ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        alert("MetaMask already connected:", accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);

        selectedProvider.value = provider;
        account.value = accounts[0];
        balance.value = await getWalletBalance(provider, accounts[0]);
      }
    } catch (error) {
      console.error("Error checking existing connection:", error);
    }
  }});

const disconnectWallet = async () => {
  selectedProvider.value = null;
  account.value = null;
  balance.value = null;
  alert("To fully disconnect, go to MetaMask and remove this site from the connected sites.");
};

const fetchCryptoData = async () => {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1");
    cryptos.value = await response.json();
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
};
</script>

<template>
  <div>
    <header>
      <h1>App Test</h1>
      <button @click="()=>{
        if(account){
          disconnectWallet();
        }else{
          connectWallet();
        }
      }">{{account==null?'Connect Wallet':'Disconnect Wallet'}}</button>
      
    </header>
    <section class="card">
      <p v-if="!account">No wallet connected</p>
      <p v-if="account">Connected: {{ account }}</p>
      <p v-if="balance">Balance: {{ balance }} ETH</p>
      <p v-if="account"class="note">To switch wallets, use MetaMask.</p>
    </section>
    <section class="card">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Asset Name</th>
            <th>Ticker</th>
            <th>Price</th>
            <th>Total Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crypto in cryptos" :key="crypto.id">
            <td><img :src="crypto.image" alt="Crypto Logo" width="30" height="30" /></td>
            <td>{{ crypto.name }}</td>
            <td>{{ crypto.symbol.toUpperCase() }}</td>
            <td>{{ crypto.current_price }}</td>
            <td>{{ crypto.total_volume }}</td>
          </tr>
        </tbody>
      </table>
      {{ cryptos.length > 0 ? "" : "Loading.." }}
      <p v-if="cryptos.length > 0" style="color: dimgrey;font-size: 10px;margin-top: 2rem;">*Data provided by coingecko</p>

    </section>
  </div>
</template>

<style scoped>
header {
  background-color: #A28CFF;
  color: white;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 0.5 2rem;
}
.card {
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 1rem 2rem;
  margin: 1rem;
  border: 1px solid #ccc;
  color: black;
  min-height: 100px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  /* border-bottom: 1px solid #ccc; */
  padding: 0.5rem;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
table tr:nth-child(odd) {
  background-color: #e4e4e4; /* Light gray for odd columns */
}
</style>
