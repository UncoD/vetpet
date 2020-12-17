<template>
  <div class="container">
    <b-table striped bordered :items="clients" :fields="fields">
      <template #head(edit)>
        <b-button
          v-b-modal.modal-add-client
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
          v-b-modal.modal-delete-client
          variant="danger"
          @click="deleteClientIndex = data.item.id"
        >
          <b-icon icon="trash" />
        </b-button>
      </template>
      <template #cell(name)="data">
        <input
          v-if="isEdit[data.index]"
          v-model="clients[data.index].name"
          type="text"
        >
        <span v-else>{{ data.value }}</span>
      </template>
      <template #cell(phone)="data">
        <input
          v-if="isEdit[data.index]"
          v-model="clients[data.index].phone"
          type="text"
        >
        <span v-else>{{ data.value }}</span>
      </template>
      <template #cell(address)="data">
        <input
          v-if="isEdit[data.index]"
          v-model="clients[data.index].address"
          type="text"
        >
        <span v-else>{{ data.value }}</span>
      </template>
    </b-table>

    <b-modal
      id="modal-add-client"
      title="Добавление клиента"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="ФИО"
          label-for="name-input"
          invalid-feedback="Введите ФИО"
          :state="newClientState"
        >
          <b-form-input
            id="name-input"
            v-model="newClient.name"
            :state="newClientState"
            required
            maxlength="100"
          />
        </b-form-group>
        <b-form-group
          label="Телефон"
          label-for="phone-input"
          invalid-feedback="Введите Телефон"
          :state="newClientState"
        >
          <b-form-input
            id="phone-input"
            v-model="newClient.phone"
            :state="newClientState"
            required
            maxlength="20"
          />
        </b-form-group>
        <b-form-group
          label="Адрес"
          label-for="address-input"
          invalid-feedback="Введите адрес"
          :state="newClientState"
        >
          <b-form-input
            id="address-input"
            v-model="newClient.address"
            :state="newClientState"
            required
            maxlength="200"
          />
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      id="modal-delete-client"
      title="Удалить записи о клиенте?"
      @ok="deleteClient"
    >
      <p class="my-2">
        Удалить клиента и все записи о нем безвозвратно?
      </p>
    </b-modal>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, $axios }) {
    const clients = await $axios.$get('/api/get-clients')
    return { clients }
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'Клиент', sortable: true },
        { key: 'phone', label: 'Телефон', sortable: true },
        { key: 'address', label: 'Адрес', sortable: true },
        { key: 'edit', label: '' }
      ],
      isEdit: [],
      newClient: {
        name: '',
        phone: '',
        address: ''
      },
      newClientState: null,
      deleteClientIndex: null
    }
  },
  mounted () {
    this.isEdit = Array(this.clients.length).fill(false)
  },
  methods: {
    setEdit (index) {
      this.$set(this.isEdit, index, !this.isEdit[index])
      if (!this.isEdit[index]) {
        this.saveClient(index)
      }
    },
    async saveClient (index) {
      await this.$axios.$post('/api/update-client', this.clients[index])
    },
    async deleteClient () {
      const id = this.deleteClientIndex
      await this.$axios.$post('/api/delete-client', { id })
      this.$nextTick(() => {
        this.$bvModal.hide('modal-delete-client')
      })
      this.deleteClientIndex = null
      this.clients = await this.$axios.$get('/api/get-clients')
      this.isEdit = Array(this.clients.length).fill(false)
    },
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.newClientState = valid
      return valid
    },
    resetModal () {
      this.newClient.name = ''
      this.newClient.phone = ''
      this.newClient.address = ''
      this.newClientState = null
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    async handleSubmit () {
      if (!this.checkFormValidity()) {
        return
      }

      await this.$axios.$post('/api/add-client', this.newClient)
      this.clients = await this.$axios.$get('/api/get-clients')

      this.$nextTick(() => {
        this.$bvModal.hide('modal-add-client')
      })
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
</style>
