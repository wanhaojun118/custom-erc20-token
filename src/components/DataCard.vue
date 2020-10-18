<template>
  <div class="data-card">
    <div class="flex-row">
      <img v-if="src" :src="src" />
      <h2 class="title">{{ title }}</h2>
    </div>
   
    <div class="flex-column">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <br />
    <div class="flex-column">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
    <br />
    <div>
      ========== PRICES ==========<br />
      1 Dragon = 0.0000 $<br />
      1 USDJ = 0.0000 $<br /><br />
      ====== Dragon REWARDS ======<br />
      Claimable Rewards : 0.0000  Dragon = $0.0000<br />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'data-card',
  props: {
    src: String,
    title: String,
    description: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.data-card {
  padding: 14px 24px 24px;
  border: 1px solid #efc6ed;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0 #e7d7ea;
  position: relative;
  margin: 0 15px 30px;
  max-width: 300px;
  min-width: 300px;
  height: 350px;
  text-align: left;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  h2 {
    margin: 5px 0 0 0;
  }

  p {
    font-size: 16px;
    line-height: 16px;
    margin: 0;
  }
}

.title {
  font-weight: 500;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: left;
}
</style>
