<template>
  <div class="container">
    <!-- <b-form-group
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
    </b-form-group> -->
    <div class="menu">
      <b-button
        v-b-modal.modal-add-reception
        variant="success"
      >
        <b-icon icon="plus" />
      </b-button>
      <!-- <b-button
        v-b-modal.modal-add-client
        variant="primary"
      >
        Фильтры
      </b-button> -->
    </div>
    <b-table
      striped
      bordered
      class="reception-table"
      :items="receptions"
      :fields="fields"
      @row-clicked="onRowClick"
    >
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-table
            v-if="medicineItems[row.item.reception] && medicineItems[row.item.reception].length > 0"
            class="inner-table"
            fixed
            small
            bordered
            :items="medicineItems[row.item.reception]"
            :fields="medicineFields"
          />
          <b-table
            v-if="serviceItems[row.item.reception] && serviceItems[row.item.reception].length > 0"
            class="inner-table"
            fixed
            small
            bordered
            :items="serviceItems[row.item.reception]"
            :fields="serviceFields"
          />
          <p>Стоимость приема: {{ row.item.rec_cost }}₽</p>
        </b-card>
      </template>
    </b-table>

    <b-modal
      id="modal-add-reception"
      title="Новый прием"
      no-close-on-backdrop
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form">
        <b-form-group
          label="Владелец"
          invalid-feedback="Выберите владельца"
          :state="newRecState"
        >
          <input v-model="newRec.clientId" hidden required>
          <v-select
            v-model="newRec.clientId"
            :options="clients"
            :reduce="client => client.id"
            label="name"
            @input="getPets()"
          >
            <template v-slot:option="option">
              <div>{{ option.name }}</div>
              <div class="client-phone">
                {{ option.phone }}
              </div>
            </template>
          </v-select>
        </b-form-group>
        <b-form-group
          label="Питомец"
          invalid-feedback="Выберите питомца"
          :state="newRecState"
        >
          <input v-model="newRec.petId" hidden required>
          <v-select
            v-model="newRec.petId"
            :options="pets"
            :reduce="pet => pet.id"
            label="name"
          >
            <template v-slot:no-options="{ searching }">
              <em v-if="searching" style="opacity: 0.5;">Питомец не найден</em>
              <em v-else style="opacity: 0.5;">Выберите владельца</em>
            </template>
          </v-select>
        </b-form-group>
        <b-form-group label="Стоимость приема (₽)">
          <b-form-input v-model.number="newRec.cost" type="number" min="0" />
        </b-form-group>
        <b-form-group label="Лекарства">
          <v-select
            v-model="newRec.medicines"
            :options="medicines"
            label="name"
            multiple
            @input="setNewRecMedCount"
          />
        </b-form-group>
        <b-table
          v-show="newRec.medicines && newRec.medicines.length > 0"
          class="rec-med-table"
          striped
          small
          bordered
          fixed
          :items="newRec.medicines"
          :fields="newRecMedFields"
        >
          <template #cell(need)="data">
            <input v-model.number="newRec.needMedCount[data.item.id]" class="med-input" type="number" min="1" :max="data.item.quantity">
          </template>
          <template #cell(remove)="data">
            <b-button
              class="remove-med"
              variant="danger"
              @click="removeNewRecMed(data.item.id)"
            >
              <b-icon icon="x" />
            </b-button>
          </template>
        </b-table>
        <b-form-group label="Услуги">
          <v-select
            v-model="newRec.services"
            :options="services"
            label="name"
            multiple
          />
        </b-form-group>
        <b-form-group label="Инструкция">
          <b-form-textarea v-model="newRec.instruction" />
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
Vue.component('v-select', vSelect)
export default {
  async asyncData ({ params, $axios }) {
    const medicines = await $axios.$get('/api/get-medicines')
    const clients = await $axios.$get('/api/get-clients')
    const receptions = await $axios.$get('/api/get-receptions')
    const services = await $axios.$get('/api/get-services')

    return { clients, receptions, medicines, services }
  },
  data () {
    return {
      medicineItems: {},
      serviceItems: {},
      pets: [],
      fields: [
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
          formatter: value =>
            (new Date(value))
              .toLocaleString('ru-RU',
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  hour12: false,
                  minute: 'numeric',
                  second: 'numeric'
                }
              )
        },
        { key: 'client', label: 'Владелец', sortable: true },
        { key: 'pet_name', label: 'Кличка', sortable: true },
        { key: 'pet_kind', label: 'Вид', sortable: true },
        { key: 'instruction', label: 'Инструкция', sortable: true },
        { key: 'cheque', label: 'Чек (₽)', sortable: true }
      ],
      medicineFields: [
        { key: 'medicine', label: 'Лекарство', sortable: true },
        { key: 'quantity', label: 'Количество', sortable: true },
        { key: 'cost', label: 'Стоимость (₽)', sortable: true }
      ],
      serviceFields: [
        { key: 'name', label: 'Название', sortable: true },
        { key: 'price', label: 'Цена (₽)', sortable: true }
      ],
      newRecMedFields: [
        { key: 'name', label: 'Название' },
        { key: 'quantity', label: 'На складе' },
        { key: 'need', label: 'Выписать' },
        { key: 'remove', label: '' }
      ],
      searchClient: '',
      startDate: null,
      endDate: null,
      newRec: {
        clientId: null,
        petId: null,
        cost: 0,
        instruction: '',
        medicines: null,
        needMedCount: {},
        services: null
      },
      newRecState: null
    }
  },
  methods: {
    async search () {
      this.receptions = await this.$axios.$post('/api/get-client-receptions', {
        id: this.searchClient,
        startDate: this.startDate,
        endDate: this.endDate
      })
    },
    async onRowClick (row) {
      if (!row._showDetails) {
        this.medicineItems[row.reception] = await this.$axios.$post('/api/get-reception-recipe', { id: row.reception })
        this.serviceItems[row.reception] = await this.$axios.$post('/api/get-reception-service', { id: row.reception })
      }
      this.$set(row, '_showDetails', !row._showDetails)
    },
    async getPets (id) {
      this.pets = await this.$axios.$post('/api/get-client-pets-by-id', { id: this.newRec.clientId })
      this.newRec.petId = null
    },
    removeNewRecMed (id) {
      const ind = this.newRec.medicines.findIndex(m => m.id === id)
      this.newRec.medicines.splice(ind, 1)
      delete this.newRec.needMedCount[id]
    },
    setNewRecMedCount (meds) {
      for (const m in meds) {
        if (!this.newRec.needMedCount[meds[m].id]) {
          this.newRec.needMedCount[meds[m].id] = 1
        }
      }
    },
    resetModal () {
      this.newRec = {
        clientId: null,
        petId: null,
        cost: 0,
        instruction: '',
        medicines: null,
        needMedCount: {},
        services: null
      }
      this.newRec.needMedCount = {}
      this.newRecState = null
    },
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.newRecState = valid
      return valid
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    async handleSubmit () {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$axios.$post('/api/add-reception', {
        pet_id: this.newRec.petId,
        rec_cost: this.newRec.cost,
        instruction: this.newRec.instruction,
        medicines: this.newRec.needMedCount,
        services: this.newRec.services
      })

      this.receptions = await this.$axios.$get('/api/get-receptions')

      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-reception')
      })
    }
  }
}
</script>

<style lang="scss">
.menu {
  align-self: flex-start;
  margin-top: 30px;
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
  margin-top: 30px;

  tr {
    cursor: pointer;
  }
  th:last-child, td:last-child {
    text-align: center;
    width: 130px;
  }
  th:nth-child(6), td:nth-child(6) {
    text-align: center;
    width: 100px;
  }

  p {
    text-align: left;
    margin: 0;
  }
}
.inner-table {
  tr {
    cursor: default;

    td {
      padding-left: 10px;
      padding-right: 10px;

      &:first-child {
        text-align: left;
      }
    }
    td::first-letter {
      text-transform: uppercase;
    }
  }
  thead tr:nth-of-type(odd) {
    background: white;
  }
  th:last-child, td:last-child {
    width: auto;
  }
}
.client-phone {
  font-size: 15px;
  color: #3c3c3c80;
}
.vs__dropdown-option--highlight .client-phone {
  color: #ebebeb;
}
.rec-med-table {
  th:last-child, td:last-child {
    width: 40px;
  }
  .remove-med {
    height: 30px;
    width: 30px;
    padding: 0;
  }
  .med-input {
    width: 100%;
  }
}
</style>
