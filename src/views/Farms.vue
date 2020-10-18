<template>
  <div class="farms">
    <template v-for="(d, k) in description">
      <p v-html="d" :key="k"></p>
    </template>
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

.grid-content {
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: center;
}

.block {
  display: block;
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
</style>


<script>
import FarmCard from '@/components/FarmCard.vue';
import LogoPath from '@/assets/logo.png';

export default {
  name: 'Farms',
  components: {
    FarmCard
  },
  data: function() {
    return {
      description: [
        '<h1>Select a farm.</h1>',
        `<label>Earn Dragon tokens by providing liquidity.</label>`,
      ],
      logo: LogoPath,
      farms: [
        { 
          src: LogoPath,
          title: 'DRAGON/TRX LP',
          description: 'Deposit DRAGON/TRX LP token and Earn Dragon',
          value: 'infinity',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'BALL/TRX LP',
          description: 'Deposit BALL/TRX LP token and Earn Dragon',
          value: 'infinity',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'BALL',
          description: 'Deposit BALL<br />Earn Dragon',
          value: 'infinity',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'USDJ',
          description: 'Deposit BALL<br />Earn Dragon',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'PEARL',
          description: 'Deposit BALL<br />Earn Dragon',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'TAI',
          description: 'Deposit BALL<br />Earn Dragon',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'JST',
          description: 'Deposit BALL<br />Earn Dragon',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'JFI',
          description: 'Deposit BALL<br />Earn Dragon',
          value: '-',
          canSelect: true,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'SUN',
          description: 'Deposit BALL<br />Earn Dragon',
          value: 'infinity',
          canSelect: false,
          code: 'https://www.google.com',
        },
        { 
          src: LogoPath,
          title: 'USDT',
          description: 'Deposit BALL<br />Earn Dragon',
          value: 'infinity',
          canSelect: false,
          code: null,
        },
        { 
          src: LogoPath,
          title: 'TRX',
          description: 'Deposit BALL<br />Earn Dragon',
          value: 'infinity',
          canSelect: false,
          code: null,
        },
      ]
    }
  }
}
</script>
