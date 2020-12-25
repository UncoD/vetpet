<template>
  <div class="container">
    <h3>Анализ клиентской базы</h3>
    <h4>Клиентское пользование услугами ветклиники</h4>
    <b-form-group label="Выберите тип среза" class="slice-types">
      <b-form-radio v-model="sliceType" name="slice-type" value="D" @change="changeSliceType">Срез по дате</b-form-radio>
      <b-form-radio v-model="sliceType" name="slice-type" value="S" @change="changeSliceType">Срез по услуге</b-form-radio>
      <b-form-radio v-model="sliceType" name="slice-type" value="C" @change="changeSliceType">Срез по клиенту</b-form-radio>
    </b-form-group>
    <date-picker v-show="sliceType !== ''" v-model="timeRange" type="month" range />
    <v-select
      v-show="sliceType === 'S'"
      v-model="sliceService"
      :options="services"
      label="name"
    />
    <v-select
      v-show="sliceType === 'C'"
      v-model="sliceClient"
      :options="clients"
      label="name"
    >
      <template v-slot:option="option">
        <div>{{ option.name }}</div>
        <div class="client-phone">
          {{ option.phone }}
        </div>
      </template>
    </v-select>
    <b-button
      v-show="sliceType !== ''"
      :disabled="(sliceType === 'D' && !timeRange)
        || (sliceType === 'C' && (!sliceClient || !timeRange))
        || (sliceType === 'S' && (!sliceService || !timeRange))"
      @click="makeItems"
    >
      Получить результаты
    </b-button>
    <div v-show="sliceType === ''" class="default">
      <h5>Пользование услугами за всё время</h5>
      <b-table small bordered :items="items" :fields="servicesFields" />
    </div>
    <div v-show="sliceType !== '' && items.length != 0" class="custom">
      <h5 v-if="timeRange !== null">
        Срез с {{ formatDate(timeRange[0]) }} по {{ formatDate(timeRange[1]) }}
      </h5>
      <h6 v-if="sliceService">Услуга: {{ sliceService.name }}</h6>
      <h6 v-if="sliceClient">Клиент: {{ sliceClient.name }}</h6>
      <b-table small bordered :items="items" :fields="sliceService ? dateFields : servicesFields" />
    </div>
    <b-table
      class="services-table"
      fixed
      small
      bordered
      :items="provided"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import _ from 'lodash'
Vue.component('v-select', vSelect)
export default {
  components: { DatePicker },
  async asyncData ({ params, $axios }) {
    const services = await $axios.$get('/api/get-services')
    const clients = await $axios.$get('/api/get-clients')
    const provided = await $axios.$post('/api/get-provided-services', { date: '2020-10-01' })

    const servicesFields = [{ key: 'client', label: 'Клиент' }]
      .concat(services.map((s) => { return { key: s.id.toString(), label: s.name } }))

    return { services, provided, servicesFields, clients }
  },
  data () {
    return {
      timeRange: null,
      items: [],
      sliceType: '',
      sliceClient: null,
      sliceService: null,
      dateFields: []
    }
  },
  created () {
    const defaultSlice = this.getDefaultSlice()
    this.getSliceByDate(defaultSlice)
  },
  methods: {
    getDefaultSlice (startDate = 0, endDate = 0) {
      const slice = this.provided.filter((p) => {
        const date = new Date(p.date).setHours(0, 0, 0, 0)
        return (startDate > 0 ? (date >= startDate) : true) &&
        (endDate > 0 ? (date < endDate) : true)
      })

      return slice
    },
    getSliceByDate (slice) {
      this.items = []
      const groupByClient = _.groupBy(slice, 'client_id')
      for (const c in groupByClient) {
        let groupByService = _.groupBy(groupByClient[c], 'service_id')
        groupByService = Object.fromEntries(
          Object.entries(groupByService)
            .map(s => [s[0], s[1].reduce((acc, k) => acc + k.cost, 0)])
        )
        this.items.push({
          client: groupByClient[c][0].client, ...groupByService
        })
      }
    },
    getSliceByClient (slice) {
      this.items = []
    },
    getSliceByService (slice) {
      this.items = []
      const groupByMonth = _.groupBy(slice.map(s => Object.assign({ date: this.formatDate(new Date(s.date)) })), 'date')
      console.log(groupByMonth)
      this.dateFields = [{ key: 'client', label: 'Клиент' }].concat(Object.keys(groupByMonth))
      console.log(this.dateFields)
    },
    makeItems () {
      const endDate = new Date(this.timeRange[1])
      const defaultSlice = this.getDefaultSlice(new Date(this.timeRange[0]), endDate.setMonth(endDate.getMonth() + 1))

      switch (this.sliceType) {
        case 'D':
          this.getSliceByDate(defaultSlice)
          break
        case 'S':
          this.getSliceByService(defaultSlice)
          break
        case 'C':
          this.getSliceByClient(defaultSlice)
          break
      }
    },
    changeSliceType () {
      this.items = []
      this.timeRange = null
      this.sliceClient = null
      this.sliceService = null
    },
    formatDate (date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}`
    }
  }
}
</script>

<style lang="scss">
.services-table {
  margin-top: 30px;
}
h3 {
  margin-top: 30px;
}
h4 {
  margin-bottom: 30px;
}
.default, .custom {
  margin-top: 30px;
}
.slice-types {
  margin-bottom: 20px;
  legend {
    text-align: center;
  }
  div {
    display: flex;
    .custom-radio {
      margin: 0 10px;
    }
  }
}
.v-select {
  width: 320px;
}
</style>
