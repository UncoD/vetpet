<template>
  <div class="container">
    <h4>Отчет о приемах клиента за определенный период</h4>
    <b-form-group
      class="search"
    >
      <b-form-group
        label="Начало периода"
        label-for="datepicker-start"
      >
        <b-form-datepicker
          id="datepicker-start"
          v-model="startDate"
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          locale="en"
        />
      </b-form-group>
      <b-form-group
        label="Конец периода"
        label-for="datepicker-end"
      >
        <b-form-datepicker
          id="datepicker-end"
          v-model="endDate"
          :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
          locale="en"
        />
      </b-form-group>
      <b-form-group
        label="Клиент"
        label-for="search-input"
      >
        <v-select
          v-model="searchClient"
          :options="clients"
          :reduce="client => client.id"
          label="name"
        />
      </b-form-group>
      <b-button
        variant="primary"
        @click="search"
      >
        Сформировать отчет
      </b-button>
    </b-form-group>
    <b-table striped bordered :items="items" :fields="fields" />
  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
Vue.component('v-select', vSelect)
export default {
  async asyncData ({ params, $axios }) {
    const clients = await $axios.$get('/api/get-clients')
    return { clients }
  },
  data () {
    return {
      items: [],
      fields: [
        { key: 'date', label: 'Дата', sortable: true },
        { key: 'client', label: 'Владелец', sortable: true },
        { key: 'pet_name', label: 'Кличка', sortable: true },
        { key: 'pet_kind', label: 'Вид', sortable: true },
        { key: 'instruction', label: 'Инструкция', sortable: true },
        { key: 'cheque', label: 'Чек', sortable: true }
      ],
      searchClient: '',
      startDate: null,
      endDate: null
    }
  },
  methods: {
    async search () {
      this.items = await this.$axios.$post('/api/get-client-receptions', {
        id: this.searchClient,
        startDate: this.startDate,
        endDate: this.endDate
      })
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
    width: 300px;
    height: 40px;
  }
}
.b-form-datepicker {
  width: 190px;

  .btn {
    width: 50px;
  }
}
</style>
