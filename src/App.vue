<script setup lang="ts">
</script>

<template>
  <div>
    <header>
      <h1>App Test</h1>
      <button>Connect Wallet</button>
    </header>
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
  min-height: 500px;
}
table {
  width: 100%;
  border-collapse: collapse;
  color: black;
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
