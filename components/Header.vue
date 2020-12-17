<template>
  <div class="header">
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
      href="#"
    >
      Поставщики
    </b-button>
  </div>
</template>

<style lang="scss" scoped>
.header {
  height: 70px;
  background: #94bde5;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .btn {
    margin: 0 5px;
  }
}
</style>
