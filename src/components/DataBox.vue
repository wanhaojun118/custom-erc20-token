<template>
  <div class="data-box">
    <div class="flex-row">
      <img v-if="src" :src="src" />
      <div>
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'data-box',
  props: {
    src: String,
    title: String,
    description: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.data-box {
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  max-width: 400px;
  width: 100%;
  padding: 24px;
  text-align: left;
  margin: 40px 18px 20px;
  background: #f0e7ea;
  border: 1px solid #efc6ed;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0 #e7d7ea;
  
  img {
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }

  h2 {
    margin: 0;
  }

  p {
    font-size: 16px;
    line-height: 16px;
    margin: 0;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: left;
}


@media screen and (max-width: 424px) {
  .data-box {
    width: auto;
  }
}
</style>
