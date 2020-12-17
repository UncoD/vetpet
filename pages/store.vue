<template>
  <div class="container">
    <h4>Лекарства на складе</h4>
    <b-form-group
      class="search"
    >
      <b-form-group
        label="На складе меньше, чем:"
        label-for="quantity-input"
      >
        <b-form-input
          id="quantity-input"
          v-model="quantity"
          type="number"
        />
      </b-form-group>
      <b-form-group
        label="Нужно заказать:"
        label-for="need-input"
      >
        <b-form-input
          id="need-input"
          v-model="needCount"
          type="number"
        />
      </b-form-group>
      <b-button
        variant="primary"
        @click="search"
      >
        Рассчитать заказы
      </b-button>
      <b-button
        v-if="!isMedicineView"
        variant="primary"
        class="back-btn"
        @click="isMedicineView = true"
      >
        <b-icon icon="chevron-left" />
      </b-button>
    </b-form-group>
    <b-table v-if="isMedicineView" striped bordered :items="store" :fields="storeFields" />
    <b-table v-else striped bordered :items="needItems" :fields="needFields" />
  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
Vue.component('v-select', vSelect)
export default {
  async asyncData ({ params, $axios }) {
    const store = await $axios.$get('/api/get-medicines')
    return { store }
  },
  data () {
    return {
      needItems: [],
      storeFields: [
        { key: 'name', label: 'Название', sortable: true },
        { key: 'description', label: 'Описание', sortable: true },
        { key: 'quantity', label: 'На складе', sortable: true },
        { key: 'sell_price', label: 'Цена продажи (руб.)', sortable: true },
        { key: 'buy_price', label: 'Цена покупки (руб.)', sortable: true }
      ],
      needFields: [
        { key: 'name', label: 'Поставщик', sortable: true },
        { key: 'phone', label: 'Телефон', sortable: true },
        { key: 'cheque', label: 'Стоимость заказа', sortable: true }
      ],
      isMedicineView: true,
      quantity: 0,
      needCount: 0
    }
  },
  methods: {
    async search () {
      this.needItems = await this.$axios.$post('/api/get-order-info', {
        quantity: this.quantity,
        need: this.needCount
      })

      this.isMedicineView = false
    }
  }
}
</script>

<style lang="scss">
h4 {
  margin-top: 30px;
}
.table {
  margin-top: 30px;

  td input {
    width: 100%;
  }

  th:last-child, td:last-child {
    text-align: center;
    width: 130px;
  }
}
.search {
  margin-top: 30px;
  align-self: start;

  > div {
    display: flex;
    align-items: flex-end;

    .form-group {
      margin: 0;

      .v-select {
        height: 40px;
        width: 400px;

        .vs__dropdown-toggle {
          height: 100%;
        }
      }
    }
  }

  .btn {
    width: 270px;
    height: 40px;
  }
  .back-btn {
    margin-left: 15px;
    width: 50px;
  }
}
.b-form-datepicker {
  width: 190px;

  .btn {
    width: 50px;
  }
}
.reception-table {
  tr {
    cursor: pointer;
  }
}
</style>
