<template>
  <div class="home">
    <template v-for="(d, k) in description">
      <p v-html="d" :key="k"></p>
    </template>
    <div class="break-word-all">
      <h3>DRAGON Address: <label>TYLPtEvANesoVWEKKzbDFnfuiKdaRNkpmb</label></h3>
      <h3>BALL Address: <label>TWWqNMyDTB3yhJ1bhz1Rwow1AVTfw46rqu</label></h3>
    </div>
    <div>
      <button class="btn-swap">A</button>
      <button class="btn-swap">B</button>
    </div>
    <div class="flex-row">
      <DataBox :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataBox title="10,000" description="Total Supply"/>
    </div>
    <div><br /></div>
    <div class="grid-content">
      <DataCard key="1" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataCard key="2" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataCard key="3" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataCard key="4" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataCard key="5" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataCard key="6" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
      <DataCard key="7" :src="logo" title="0.000000" description="Dragon Ball Balance"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn-swap {
  width: 300px;
  display: inline-block;
  margin: 20px 5% 0;
  align-items: center;
  background-color: #f0e7ea;
  box-shadow: 4px 4px 8px #e2cfd5, -8px -8px 16px #f7f2f4;
  color: #d1004b;
  cursor: pointer;
  font-size: 16px;
  line-height: 56px;
  height: 56px;
  font-weight: 700;
  justify-content: center;
  border-radius: 12px;
  padding: 0 40px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.grid-content {
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: center;
}

.break-word-all {
  word-break: break-all;
}

@media screen and (min-width: 850px) and (max-width: 1200px) {
  .grid-content {
    grid-template-columns: auto auto;
  }
}

@media screen and (max-width: 849px) {
  .grid-content {
    grid-template-columns: auto;
  }
}

@media screen and (max-width: 649px) {
  .flex-row {
    flex-direction: column;
  }
}
</style>

<script>
// @ is an alias to /src
import DataBox from '@/components/DataBox.vue'
import DataCard from '@/components/DataCard.vue'
import LogoPath from '@/assets/logo.png'

export default {
  name: 'Home',
  components: {
    DataBox, DataCard
  },
  props: {
    msg: String,
    msgObj: Object,
  },
  data: function() {
    return {
      logo: LogoPath,
      description: [
        '<h1>Stake Anytime, Unstake Anytime, Get Rewards Instantly.</h1>',
        `<label>It's a great day to mine some Dragon Balls on TRON.</label>`,
        `<label>Dragon Finance's Smart Contract has been audited by Beosin. Check Audit Report here.</label>`
      ]
    }
  }
}
</script>
