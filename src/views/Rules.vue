<template>
  <div class="rules">
    <h1>Rules</h1>

    <div class="rules-content">
      DRAGON will be distributed in the sprit of YFI: no pre-mine, no founder shares, no VC interests - simply equal-opportunity staking distribution to attract a broad and vision-aligned community to steward the future of the protocol and token.

      <h2>Regarding Delays</h2>
      Q: Why there are delays in updating the numbers?
      <br /><br />
      A: On opening the website, the website will try to talk with TronLink to get the numbers. Tronlink itself has delays in displaying the assets, the website can only show updated numbers once Tronlink is updated.

      <h2>Pools</h2>
      <label v-for="(p, k) in pools" :key="'p' + k" v-html="`${p}<br />`"></label>

      <h2>Address</h2>
      <div v-for="(a, k) in address" :key="'a' + k">
        <h3>{{ a.name }}</h3>
        <label v-if="a.token" class="block">
          <span>Token Address: </span>
          <a href="javascript:" class="break-word-all">{{ a.token }}</a>
        </label>
        <label v-if="a.pool" class="block">
          <span>Pool Address: </span>
          <a href="javascript:" class="break-word-all">{{ a.pool }}</a>
        </label>
      </div>


      <h2>Distribution Timetable</h2>
      Each pool has 45 days for mining since its start. Every three days, the mineable DRAGON tokens will reduce in half for the next stage, and there’re totally 15 mining stages. This is to encourage miners and communities to participate mining early on to get maximum rewards in DRAGON.

      <h2>Governance</h2>
      The rest of the DRAGON token would be locked in the contract and entirely governed by DRAGON holders, for example, vote for adding more distribution pools.
    </div>
  </div>
</template>


<style scoped lang="scss">
.rules-content {
  margin: 0 auto;
  text-align: left;
  max-width: 956px;
  width: 50%;
  border: 2px solid #aa8592;
  border-radius: 12px;
  padding: 24px;
}

.block {
  display: block;
}

.break-word-all {
  word-break: break-all;
}

@media screen and (max-width: 850px) {
  .rules-content {
    width: auto;
  }
}
</style>


<script>

export default {
  name: 'Rules',
  data: function() {
    return {
      pools: [
        'USDJ 500',
        'PEARL 500',
        'TAI 500',
        'JST 500',
        'JFI 500',
        'DRAGON/TRX LP 2500',
        'BALL 2000',
        'BALL/TRX LP 1000',
        'USDT 1000',
        'SUN 500',
        '500 Reserved for early justswap liquidity<br />',
        'Adding more pools will subject to community vote.'
      ],
      address: [
        { 
          name: 'DRAGON',
          token: 'TYLPtEvANesoVWEKKzbDFnfuiKdaRNkpmb',
          pool: null,
        },
        { 
          name: 'DRAGON/TRX LP',
          token: null,
          pool: 'TC7CyQt6MU5AGnomxPSC51G1HbzCJRFvpk',
        },
        { 
          name: 'BALL/TRX LP',
          token: null,
          pool: 'TP6eUbxGLsBxc6HwMziEy6TTy21dXjofZ8',
        },
        { 
          name: 'PEARL',
          token: 'TGbu32VEGpS4kDmjrmn5ZZJgUyHQiaweoq',
          pool: 'TWJGyUGgYb283CWchS4o8iBnH8xWSdFH81',
        },
        { 
          name: 'TAI',
          token: 'TRwS7apsNdRGzMBfhB2hVC4RhqfubUYZ8P',
          pool: 'TSPdPBHBQpnWC7LH5iJvJgi8yPD7MN7m7u',
        },
        { 
          name: 'JST',
          token: 'TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9',
          pool: 'THfXJt2o7qY2bNDUM5xGipGVjDoga6M24Q',
        },
        { 
          name: 'JFI',
          token: 'TN7zQd2oCCguSQykZ437tZzLEaGJ7EGyha',
          pool: 'TYerCtnmZ93nwVpfy8oWWVafbUnH9oHcZb',
        },
      ]
    }
  }
}
</script>
