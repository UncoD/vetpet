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
      <b-button
        v-if="isRecipeView"
        variant="primary"
        class="back-btn"
        @click="isRecipeView = false"
      >
        <b-icon icon="chevron-left" />
      </b-button>
    </b-form-group>
    <b-table v-if="isRecipeView" striped bordered :items="recipeItems" :fields="recipeFields" />
    <b-table
      v-else
      striped
      bordered
      class="reception-table"
      :items="items"
      :fields="fields"
      @row-clicked="item=>onRowClick(item.reception)"
    />
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
      recipeItems: [],
      fields: [
        { key: 'date', label: 'Дата', sortable: true },
        { key: 'client', label: 'Владелец', sortable: true },
        { key: 'pet_name', label: 'Кличка', sortable: true },
        { key: 'pet_kind', label: 'Вид', sortable: true },
        { key: 'instruction', label: 'Инструкция', sortable: true },
        { key: 'cheque', label: 'Чек', sortable: true }
      ],
      recipeFields: [
        { key: 'medicine', label: 'Лекарство', sortable: true },
        { key: 'quantity', label: 'Количество', sortable: true },
        { key: 'cost', label: 'Стоимость', sortable: true }
      ],
      searchClient: '',
      startDate: null,
      endDate: null,
      isRecipeView: false
    }
  },
  methods: {
    async search () {
      this.items = await this.$axios.$post('/api/get-client-receptions', {
        id: this.searchClient,
        startDate: this.startDate,
        endDate: this.endDate
      })
    },
    async onRowClick (item) {
      this.recipeItems = await this.$axios.$post('/api/get-reception-recipe', { id: item })
      this.isRecipeView = true
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
