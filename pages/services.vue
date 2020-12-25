<template>
  <div class="container">
    <h3>Услуги клиники</h3>
    <b-table class="service-table" striped bordered :items="services" :fields="fields" />
  </div>
</template>

<script>
export default {
  async asyncData ({ params, $axios }) {
    const services = await $axios.$get('/api/get-services')
    return { services }
  },
  data () {
    return {
      fields: [
        { key: 'name', label: 'Наименование', sortable: true },
        { key: 'price', label: 'Цена', sortable: true }
      ]
    }
  }
}
</script>

<style lang="scss">
h3 {
  margin-top: 30px;
}
.service-table {
  margin-top: 30px;

  td {
    &::first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
