<template>
<div class="title-bar">
  <img src="@/assets/logo.png">
</div>
<div class="homepage">
  <SplitterGroup direction="vertical">
    <SplitterPanel :min-size="49" class="card-splitter">
      <SplitterGroup direction="horizontal">
        <SplitterPanel :min-size="33" class="card-splitter">
          <CurrentStat/>
        </SplitterPanel>
        <SplitterResizeHandle/>
        <SplitterPanel :min-size="50" class="card-splitter">
          <StatTimeline/>
        </SplitterPanel>
      </SplitterGroup>
    </SplitterPanel>
    <SplitterResizeHandle/>
    <SplitterPanel :min-size="40" class="card-splitter">
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
}
</script>

<style>

.homepage{
  width: calc(100vw - 10px);
  height: calc(100vh - 37px);
}

.title-bar {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>