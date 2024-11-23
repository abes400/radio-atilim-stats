<template>
<title>a</title>
<div class="homepage">
  <SplitterGroup direction="vertical">
    <SplitterPanel class="card-splitter">
      <SplitterGroup direction="horizontal">
    <SplitterPanel class="card-splitter">
      <CurrentStat :stat="this.currentStat"/>
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
      //updateInterval: 1000,
      //isListening: true
    }
  },

  mounted(){
    
    // fetch stats every 3 seconds
    setInterval(async () => {
      const response = await fetch(this.url);
      this.currentStat = await(response.json())
      console.log(this.currentStat)
    }, 3000) 
    
  },
}
</script>

<style>

.homepage{
  width: calc(100vw - 10px);
  height: calc(100vh - 17px);
}

</style>