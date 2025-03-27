<template>
<div class="homepage">
  <SplitterGroup direction="vertical">
    <SplitterPanel class="card-splitter">
      <SplitterGroup direction="horizontal">
    <SplitterPanel class="card-splitter">
      <CurrentStat/>
    </SplitterPanel>
    <SplitterResizeHandle/>
    <SplitterPanel class="card-splitter">
      <StatTimeline/>
    </SplitterPanel>
  </SplitterGroup>
    </SplitterPanel>
    <SplitterResizeHandle/>
    <SplitterPanel class="card-splitter">
      <SavedLogs/>
    </SplitterPanel>
  </SplitterGroup>

</div>
  


  
</template>

<script>
import CurrentStat from './components/CurrentStat.vue'
import StatTimeline from './components/StatTimeline.vue'
import SavedLogs from './components/SavedLogs.vue'
import {SplitterGroup, SplitterPanel, SplitterResizeHandle} from 'radix-vue';
export default {
  name: 'app',
  components: {
    CurrentStat,
    StatTimeline,
    SavedLogs,

    SplitterGroup,
    SplitterPanel,
    SplitterResizeHandle

  },

  data() {
    return {
      currentStat: null,
      url: 'https://cros9.yayin.com.tr/https://radyoatilim.yayin.com.tr/stats?sid=1&json=1',
      //url: 'http://shoutcast.radyogrup.com:1010/statistics?sid=1&json=1&_=1732930231466',
      //updateInterval: 1000,
      //isListening: true
    }
  },

  mounted(){
    //this.fetchData()
    
    // fetch stats every 5 seconds
    //setInterval(this.fetchData, 5000) 
    
  },

  methods: {
    async fetchData () {
      const response = await fetch(this.url);
      this.currentStat = await(response.json())
      
      const timeInfo = new Date()
      const time = `${timeInfo.getHours()}:${timeInfo.getMinutes()}:${timeInfo.getSeconds()}`
      const date = `${timeInfo.getFullYear()}/${timeInfo.getMonth() + 1}/${timeInfo.getDate()}`
      this.currentStat.time = time;
      this.currentStat.date = date;

      console.log(this.currentStat.songtitle);
    }
  }
}
</script>

<style>

.homepage{
  width: calc(100vw - 10px);
  height: calc(100vh - 17px);
}

</style>