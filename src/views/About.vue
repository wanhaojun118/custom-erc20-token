<template>
  <div class="about">
    <template v-for="(d, k) in description">
      <p v-html="d" :key="k"></p>
    </template>

    <div class="break-word-all">
      <h3>DRACO Address: <label>TSnxjFfELL1CP9y1v3UmCh2FpcnUEvRiYE</label></h3>
    </div>

    <div>
      <button class="btn-swap">JustSwap DRACO/TRX</button>
    </div>

    <div class="flex-row">
      <DataBox :src="logo" title="0.000000" description="Draco Balance"/>
      <DataBox title="5,000,000" description="Total Supply"/>
    </div>
    <div><br /></div>
    <div class="grid-content">
       <FarmCard v-for="(f, k) in farms" 
        :key="k" 
        :src="f.src" 
        :title="f.title"
        :description="f.description"
        :value="f.value"
        :canSelect="f.canSelect"
        :code="f.code"
      />
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
import FarmCard from '@/components/FarmCard.vue'
import LogoPath from '@/assets/logo.png'

export default {
  name: 'Home',
  components: {
    DataBox, FarmCard
  },
  data: function() {
    return {
      logo: LogoPath,
      description: [
        '<h1>DragonSwap</h1>',
        `<label>Earn Draco Tokens and Share Trading Fees Forever</label>`
      ],
      farms: [
        { 
          src: LogoPath,
          title: 'DRAGON',
          description: 'Deposit DRAGON<br />Earn Draco<br />Pool Supply: 25,000',
          value: 'infinity',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'BALL',
          description: 'Deposit BALL<br />Earn Draco<br />Pool Supply: 25,000',
          value: 'infinity',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'DRAGON/TRX LP',
          description: 'Deposit DRAGON/TRX LP token and Earn Draco<br />Pool Supply: 50,000',
          value: 'infinity',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'BALL/TRX LP',
          description: 'Deposit BALL/TRX LP token and Earn Draco<br />Pool Supply: 50,000',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'DRACO',
          description: 'Deposit DRACO<br />Earn Draco<br />Pool Supply: 100,000',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'DRACO/TRX LP',
          description: 'Deposit DRACO/TRX LP and<br />Earn Draco<br />Pool Supply: 100,000',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
      ]
    }
  }
}
</script>