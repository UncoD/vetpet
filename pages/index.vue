<template>
  <div class="container">
    <div class="main-panel">
      <div class="panel-tab">
        <p>
          Прибыль за текущий день:
          <span :class="(income - consumption > 0) ? 'plus-income' : 'minus-income'">{{ income - consumption }}₽</span>
        </p>
        <p>Клиентов обслужено: {{ todayServedClients.length }}</p>
        <p>Заказов оформлено: {{ todayOrders.length }}</p>
      </div>
      <div class="panel-tab">
        <p>Клиентов: {{ clientsCount }}</p>
        <p>Питомцев: {{ petsCount }}</p>
        <a href="clients-analysis">Анализ клиентской базы...</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, $axios }) {
    const clientsCount = (await $axios.$get('/api/get-clients-count'))[0].count
    const petsCount = (await $axios.$get('/api/get-pets-count'))[0].count
    const todayServedClients = await $axios.$post('/api/get-clients-serve-count', { date: (new Date()).toLocaleString() })
    const todayOrders = await $axios.$post('/api/get-orders-after-date', { date: (new Date()).toLocaleString() })

    let income = 0
    let consumption = 0
    if (todayServedClients.length > 0) {
      income = todayServedClients.reduce((acc, c) => {
        return acc + c.cheque
      }, 0)
    }
    if (todayOrders.length > 0) {
      consumption = todayOrders.reduce((acc, c) => acc.cheque + c.cheque, { cheque: 0 })
    }

    return { clientsCount, petsCount, todayServedClients, todayOrders, income, consumption }
  }
}
</script>

<style lang="scss">
.main-panel {
  margin-top: 80px;
  display: grid;
  grid-template-columns: repeat(2, 300px);
  grid-template-rows: repeat(2, 200px);
  column-gap: 15px;
  row-gap: 15px;

  .panel-tab {
    border: 2px solid #808080;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 0 5px #00000080;
  }
}
.plus-income {
  color: #00a400;
}
.minus-income {
  color: #ba0000;
}
</style>
