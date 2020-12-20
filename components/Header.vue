<template>
  <div class="header">
    <div class="title">
      {{ header }}
    </div>
    <b-button
      href="/"
    >
      Главная
    </b-button>
    <b-button
      href="clients"
    >
      Клиенты
    </b-button>
    <b-button
      href="pets"
    >
      Питомцы
    </b-button>
    <b-button
      href="receptions"
    >
      Приемы
    </b-button>
    <b-button
      href="store"
    >
      Склад
    </b-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      header: ''
    }
  },
  created () {
    switch (this.$route.path) {
      case '/clients':
        this.header = 'Клиенты'
        break
      case '/pets':
        this.header = 'Питомцы'
        break
      case '/receptions':
        this.header = 'Список проведенных приемов'
        break
      case '/store':
        this.header = 'Склад клиники'
        break
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 70px;
  background: #94bde5;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .btn {
    margin: 0 5px;
  }

  .title {
    flex: 1;
    font-size: 35px;
    font-weight: bold;
    color: #272d9f;
  }
}
</style>
