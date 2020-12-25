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
          v-model.number="quantity"
          type="number"
        />
      </b-form-group>
      <b-form-group
        label="Нужно заказать:"
        label-for="need-input"
      >
        <b-form-input
          id="need-input"
          v-model.number="needCount"
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
        v-show="!isMedicineView"
        variant="primary"
        class="back-btn"
        @click="isMedicineView = true"
      >
        <b-icon icon="chevron-left" />
      </b-button>
      <b-button
        v-show="!isMedicineView"
        variant="success"
        class="order-btn"
        @click="makeOrder"
      >
        <b-icon icon="plus" /> Оформить все заказы
      </b-button>
    </b-form-group>
    <b-table v-show="isMedicineView" striped bordered :items="store" :fields="storeFields" />
    <b-table
      v-show="!isMedicineView"
      class="order-table"
      striped
      bordered
      :items="providers"
      :fields="needFields"
      @row-clicked="onRowClick"
    >
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-table
            class="inner-table"
            fixed
            small
            bordered
            :items="medicinesOrder[row.item.id]"
            :fields="medNeedFields"
          >
            <template #cell(cheque)="data">
              {{ data.item.buy_price * needCount }}
            </template>
          </b-table>
        </b-card>
      </template>
    </b-table>
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
      providers: [],
      medicinesOrder: {},
      storeFields: [
        { key: 'name', label: 'Название', sortable: true },
        { key: 'description', label: 'Описание', sortable: true },
        { key: 'quantity', label: 'На складе', sortable: true },
        { key: 'sell_price', label: 'Цена продажи (₽)', sortable: true },
        { key: 'buy_price', label: 'Цена покупки (₽)', sortable: true }
      ],
      medNeedFields: [
        { key: 'name', label: 'Название', sortable: true },
        { key: 'quantity', label: 'На складе', sortable: true },
        { key: 'buy_price', label: 'Цена покупки (₽)', sortable: true },
        { key: 'cheque', label: 'Стоимость покупки', sortable: true }
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
      this.providers = await this.$axios.$post('/api/get-order-info', {
        quantity: this.quantity,
        need: this.needCount
      })

      if (this.providers.length === 0) {
        this.$bvToast.toast(`Нет лекарств, количество которых меньше ${this.quantity}`, {
          title: 'Ошибка!',
          variant: 'danger',
          solid: true
        })

        return
      }

      for (let i = 0; i < this.providers.length; i++) {
        this.medicinesOrder[this.providers[i].id] =
          await this.$axios.$post('/api/get-med-by-prov-and-quant', { id: this.providers[i].id, quantity: this.quantity })
      }

      this.isMedicineView = false
    },
    async makeOrder () {
      const cost = this.providers.reduce((acc, p) => acc.cheque + p.cheque)

      await this.$axios.$post('/api/order-medicines', { medicines: this.medicinesOrder, quantity: this.needCount })

      this.$bvToast.toast(`Заказы на общую сумму ${cost}₽ оформлены`, {
        title: 'Заказы оформлены!',
        variant: 'success',
        solid: true
      })

      this.store = await this.$axios.$get('/api/get-medicines')
      this.isMedicineView = true
    },
    async onRowClick (row) {
      if (!row._showDetails) {
        this.medicinesOrder[row.id] =
          await this.$axios.$post('/api/get-med-by-prov-and-quant', { id: row.id, quantity: this.quantity })
      }
      this.$set(row, '_showDetails', !row._showDetails)
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
  .order-btn {
    margin-left: 15px;
    width: 215px;
    text-align: left;
  }
}
.b-form-datepicker {
  width: 190px;

  .btn {
    width: 50px;
  }
}
.order-table {
  tr {
    cursor: pointer;
  }
}
.inner-table {
  tr {
    cursor: default;
  }
  thead tr:nth-of-type(odd) {
    background: white;
  }
  th:last-child, td:last-child {
    width: 200px;
  }
}
</style>
