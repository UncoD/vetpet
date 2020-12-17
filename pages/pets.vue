<template>
  <div class="container">
    <b-form-group
      label="Поиск по владельцу"
      label-for="search-input"
      class="search"
    >
      <b-form-input
        id="search-input"
        v-model="searchClient"
      />
      <b-button
        variant="primary"
        @click="searchPets"
      >
        <b-icon icon="search" />
      </b-button>
    </b-form-group>
    <b-table striped bordered :items="pets" :fields="fields">
      <template #head(edit)>
        <b-button
          v-b-modal.modal-add-pet
          variant="success"
        >
          <b-icon icon="plus" />
        </b-button>
      </template>
      <template #cell(edit)="data">
        <b-button
          :variant="isEdit[data.index] ? 'primary' : 'danger'"
          @click="setEdit(data.index)"
        >
          <b-icon
            v-if="!isEdit[data.index]"
            icon="pencil-square"
          />
          <b-icon
            v-else
            icon="check2"
          />
        </b-button>
        <b-button
          v-if="isEdit[data.index]"
          v-b-modal.modal-delete-pet
          variant="danger"
          @click="deletePetIndex = data.item.id"
        >
          <b-icon icon="trash" />
        </b-button>
      </template>
      <template #cell(name)="data">
        <input
          v-if="isEdit[data.index]"
          v-model="pets[data.index].name"
          type="text"
        >
        <span v-else>{{ data.value }}</span>
      </template>
      <template #cell(kind)="data">
        <input
          v-if="isEdit[data.index]"
          v-model="pets[data.index].kind"
          type="text"
        >
        <span v-else>{{ data.value }}</span>
      </template>
    </b-table>

    <b-modal
      id="modal-add-pet"
      title="Добавление питомца"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Владелец"
          label-for="name-input"
          invalid-feedback="Выберите владельца"
          :state="newpetstate"
        >
          <v-select
            v-model="clientForNewPet"
            :options="clients"
            :reduce="client => client.id"
            label="name"
            @input="selectClientForPet"
          />
        </b-form-group>
        <b-form-group
          label="Кличка"
          label-for="name-input"
          invalid-feedback="Введите кличку"
          :state="newpetstate"
        >
          <b-form-input
            id="name-input"
            v-model="newPet.name"
            :state="newpetstate"
            required
            maxlength="100"
          />
        </b-form-group>
        <b-form-group
          label="Вид"
          label-for="kind-input"
          invalid-feedback="Введите вид"
          :state="newpetstate"
        >
          <b-form-input
            id="kind-input"
            v-model="newPet.kind"
            :state="newpetstate"
            required
            maxlength="100"
          />
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      id="modal-delete-pet"
      title="Удалить записи о питомце?"
      @ok="deletePet"
    >
      <p class="my-2">
        Удалить питомца и все записи о нем безвозвратно?
      </p>
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
    const pets = await $axios.$get('/api/get-pets')
    const clients = await $axios.$get('/api/get-clients')
    return { pets, clients }
  },
  data () {
    return {
      fields: [
        { key: 'owner', label: 'Владелец', sortable: true },
        { key: 'name', label: 'Кличка', sortable: true },
        { key: 'kind', label: 'Вид', sortable: true },
        { key: 'edit', label: '' }
      ],
      isEdit: [],
      newPet: {
        name: '',
        kind: '',
        client_id: null
      },
      newpetstate: null,
      deletePetIndex: null,
      clientForNewPet: null,
      searchClient: ''
    }
  },
  mounted () {
    this.isEdit = Array(this.pets.length).fill(false)
  },
  methods: {
    setEdit (index) {
      this.$set(this.isEdit, index, !this.isEdit[index])
      if (!this.isEdit[index]) {
        this.savePet(index)
      }
    },
    async savePet (index) {
      await this.$axios.$post('/api/update-pet', this.pets[index])
    },
    async deletePet () {
      const id = this.deletePetIndex
      await this.$axios.$post('/api/delete-pet', { id })
      this.$nextTick(() => {
        this.$bvModal.hide('modal-delete-pet')
      })
      this.deletePetIndex = null
      this.pets = await this.$axios.$get('/api/get-pets')
      this.isEdit = Array(this.pets.length).fill(false)
    },
    selectClientForPet () {
      this.newPet.client_id = this.clientForNewPet
    },
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.newpetstate = valid
      return valid
    },
    resetModal () {
      this.newPet.name = ''
      this.newPet.phone = ''
      this.newPet.address = ''
      this.newpetstate = null
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    async handleSubmit () {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$axios.$post('/api/add-pet', this.newPet)
      this.pets = await this.$axios.$get('/api/get-pets')

      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-pet')
      })
    },
    async searchPets () {
      const name = this.searchClient
      this.pets = await this.$axios.$post('/api/get-client-pets', { name })
      this.isEdit = Array(this.pets.length).fill(false)
    }
  }
}
</script>

<style lang="scss">
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
  width: 300px;
  align-self: start;

  div {
    display: flex;
  }
}
</style>
