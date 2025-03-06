<script setup lang="ts">
import { ethers } from "ethers";
import { ref, onMounted } from "vue";
const selectedProvider = ref(null);
const account = ref(null);
const balance = ref(null);
const cryptos = ref([]);
const api_status = ref('loading');

const connectMetaMask = async () => {
  try {
    // Ensure window.ethereum exists
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to continue.");
      return null;
    }

    let metamaskProvider = null;

    // If multiple providers exist, explicitly select MetaMask
    if (window.ethereum.providers) {
      metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
    } else if (window.ethereum.isMetaMask) {
      metamaskProvider = window.ethereum;
    }

    // If MetaMask is not found, alert the user
    if (!metamaskProvider) {
      alert("MetaMask is not set as the default provider. Please switch to MetaMask.");
      return null;
    }

    // Force MetaMask as the provider
    window.ethereum = metamaskProvider;

    // Request account access from MetaMask only
    const accounts = await metamaskProvider.request({ method: "eth_requestAccounts" });

    if (!accounts || accounts.length === 0) {
      alert("No accounts found. Please unlock your MetaMask wallet or make sure not conflicted with another wallet provider(only enable metamask).");
      return null;
    }

    // Set up Ethers.js provider & signer
    const provider = new ethers.BrowserProvider(metamaskProvider);
    const signer = await provider.getSigner();

    return { account: accounts[0], provider, signer };
  } catch (error) {
    alert(`Error connecting to MetaMask: ${error.message}`);
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
    api_status.value = 'success';
  } catch (error) {
    if(error.message.includes('429')) api_status.value = 'rate_limit_exceeded';
    else api_status.value = 'error';
    console.error("Error fetching crypto data:", error);
  }
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

const copyToClipboard = async (addr: string) => {
  try {
    await navigator.clipboard.writeText(addr);
    alert("Address copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
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
      <p v-if="account">Connected: {{ account.slice(0, 8) + "..." + account.slice(-8) }} <span @click="copyToClipboard(account)">copy</span></p>
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
            <th>Price(USD)</th>
            <th>Volume 24h (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="crypto in cryptos" :key="crypto.id">
            <td><img :src="crypto.image" alt="Crypto Logo" width="30" height="30" /></td>
            <td>{{ crypto.name }}</td>
            <td>{{ crypto.symbol.toUpperCase() }}</td>
            <td>{{ formatCurrency(crypto.current_price) }}</td>
            <td>{{  formatCurrency(crypto.total_volume) }}</td>
          </tr>
        </tbody>
      </table>
      {{ cryptos.length > 0 ? "" : "Loading.." }}
      <p v-if="cryptos.length > 0" style="color: dimgrey;font-size: 10px;margin-top: 2rem;">*Data provided by coingecko</p>

    </section>
  </div>
</template>
<style scoped>
p span{
  cursor: pointer;
  color: #A28CFF;
  padding: 0.2rem 1rem;
  background-color: #f4f4f4;
}
header {
  background-color: #A28CFF;
  color: white;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
button {
  background-color: white;
  color: #A28CFF;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}
button:hover {
  background-color: #ddd;
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
  padding: 0.5rem;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
table tr:nth-child(odd) {
  background-color: #e4e4e4;
}

/* Responsive Styles */
@media (max-width: 768px) {
  button {
    padding: 0.5rem;
    margin: 1rem 0.3rem;
  }
  header {
    flex-direction: column;
    text-align: center;
    padding: 15px;
  }
  .card {
    padding: 1rem;
    margin: 0.5rem;
  }
  .card p {
    font-size: 14px;
  }
  table {
    font-size: 12px;
  }
  th, td {
    padding: 0.3rem;
  }
  button {
    font-size: 14px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  button {
    padding: 0.5rem;
    margin: 1rem 0.3rem;
  }
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  th, td {
    padding: 0.2rem;
  }
  .card p {
    font-size: 10px;
  }
  button {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>
