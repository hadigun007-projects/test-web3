<script setup lang="ts">
import { ethers } from "ethers";
import { ref, onMounted } from "vue";
const selectedProvider = ref(null);
const account = ref(null);
const balance = ref(null);

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

// onMounted(async () => {
//   if (window.ethereum) {
//     try {
//       const accounts = await window.ethereum.request({ method: "eth_accounts" });

//       if (accounts.length > 0) {
//         console.log("MetaMask already connected:", accounts[0]);
//         const provider = new ethers.BrowserProvider(window.ethereum);

//         selectedProvider.value = provider;
//         account.value = accounts[0];
//         balance.value = await getWalletBalance(provider, accounts[0]);
//       }
//     } catch (error) {
//       console.error("Error checking existing connection:", error);
//     }
//   }
// });
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
      <p v-if="account">Connected: {{ account }}</p>
      <p v-if="balance">Balance: {{ balance }} ETH</p>
      <p v-if="account"class="note">To switch wallets, use MetaMask.</p>
    </section>
    <section class="card">
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Asset Name</th>
            <th>Ticker</th>
            <th>Price</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>Bitcoin</td>
            <td>BTC</td>
            <td>999.99</td>
            <td>+1.22%</td>
          </tr>
          <tr>
            <td></td>
            <td>Bitcoin</td>
            <td>BTC</td>
            <td>999.99</td>
            <td>+1.22%</td>
          </tr>
          <tr>
            <td></td>
            <td>Bitcoin</td>
            <td>BTC</td>
            <td>999.99</td>
            <td>+1.22%</td>
          </tr>
          <tr>
            <td></td>
            <td>Bitcoin</td>
            <td>BTC</td>
            <td>999.99</td>
            <td>+1.22%</td>
          </tr>
          <tr>
            <td></td>
            <td>Bitcoin</td>
            <td>BTC</td>
            <td>999.99</td>
            <td>+1.22%</td>
          </tr>
        </tbody>
      </table>

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
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: center;
}
th {
  background-color: #f4f4f4;
}
</style>
