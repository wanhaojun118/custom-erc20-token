<template>
  <div class="farm-card">
    <div>
      <div class="img-container">
        <img v-if="src" :src="src" />
      </div>
    </div>
    <h2>{{ title }}</h2>
    <p v-html="description"></p>

    <div>
      <a class="code" v-if="code" :href="code">Contract source code</a>
      <label v-else>&nbsp;</label>
    </div>
    <div><br /></div>
    <div>
      <button class="block btn-select"
        :disabled="!canSelect">{{ canSelect ? 'Select' : 'Coming Soon' }}</button>
    </div>

    <div class="flex-row white-value">
      <label>APY</label>
      <label class="value">{{ value }}</label>
      <label>%</label>
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
    value: String,
    canSelect: Boolean,
    code: String,
  },
});
</script>

<style scoped lang="scss">
.farm-card {
  padding: 24px;
  border: 1px solid #efc6ed;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0 #e7d7ea;
  position: relative;
  margin: 0 15px 30px;
  max-width: 300px;
  min-width: 300px;
  min-height: 400px;
  text-align: center;

  .img-container {
    background-color: #f0e7ea;
    font-size: 36px;
    height: 80px;
    width: 80px;
    border-radius: 50%;
    box-shadow: inset 4px 4px 8px #efc6ed, inset -6px -6px 12px #e7d7ea;
    margin: 0 auto;
    padding: 5px;
    font-style: normal;
  }

  img {
    width: 40px;
    height: 40px;
    padding: 20px;
    margin-top: 2px;
  }

  .btn-select {
    height: 56px;
    font-size: 16px;
    align-items: center;
    background-color: #f0e7ea;
    border: 0;
    border-radius: 12px;
    box-shadow: 4px 4px 8px #efc6ed, -8px -8px 16px #e7d7ea;
    cursor: pointer;
    font-weight: 700;
    justify-content: center;
    outline: none;
    padding-left: 16px;
    padding-right: 16px;
    width: 100%;
    color: #d100c9;
  }

  .white-value {
    text-align: left;
    margin-top: 20px;
    line-height: 35px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 700;
    color: #444;
    background-color: #fff;
    border-radius: 10px;
  }

  a.code {
    color: #aa8592;
  }
}

.block {
  display: block;
}

.flex-row {
  display: flex;
  flex-direction: row;
  .value {
    flex-grow: 1;
    text-align: right;
  }
}

</style>
