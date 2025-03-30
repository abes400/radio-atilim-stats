<template>
<div class="card">
<div class="card-title">
    <div class="pin-left">
        <button @click="isRecording = !isRecording">
            <font-awesome-icon v-if="!isRecording" icon="fa-solid fa-circle" />
            <font-awesome-icon v-else icon="fa-solid fa-pause"/>
        </button>
        <button :disabled="!statCount" @click="saveChart(); clearChart(); this.renderTriggerKey = !this.renderTriggerKey"> 
            <font-awesome-icon icon="fa-solid fa-download"/>
        </button>
    </div> 
    <div class="pin-right">
        <button @click="toggleChartDataset(0)" 
            :style="{'border-color': data.datasets[0].hidden ? '#00000000': '#3FB17F'}">
            Current Listeners
        </button>
        <button @click="toggleChartDataset(1)" 
            :style="{'border-color': data.datasets[1].hidden ? '#00000000' : '#337EC9' }">
            Unique Listeners
        </button>
        <button @click="toggleChartDataset(2)" 
            :style="{'border-color': data.datasets[2].hidden ? '#00000000' : '#FF9D00'}">
            Avg. Listen Time
        </button>
    </div> 
</div>
<div class="card-content">
    <div class="timeline-container pop-in">
        <chart :key="this.renderTriggerKey" :options="this.options" :data="this.data"/>
    </div>   
</div>

</div>
</template>

<script>
import chartData from '../config/chartData.json'
import {Buffer} from 'buffer';

const CURRENT_LISTENER = 0
const UNIQUE_LISTENERS = 1
const AVERAGE_TIME = 2


export default {

    data() {
        return {
            statCount: 0,
            isRecording: true,
            recordBeginDate: '',
            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: false,

                scales: {
                    listenerCountAxis: {
                        beginAtZero: false,
                        position: 'left',
                        ticks: { callback: (val) => {if(val % 1 === 0) return val;} }
                    },
                    listenTimeAxis: {
                        beginAtZero: false,
                        position: 'right',
                    },
                    
                },

                interaction: { mode: 'index' },
                
                plugins: { legend: { display: false, } }
                
            },
            data: chartData,
            renderTriggerKey: false,
        }
    },
    mounted() {
        window.ipc.on('new_stat', (new_stat) => {
            if(this.isRecording)
                this.handleStat(new_stat);
        })
    },

    props: {
        loggedStat: Object,
        maxStatRecord: {
            type: Number,
            default: 15,
        }
    },

    methods: {
        clearChart() {
            this.data.labels.length = 0
            this.data.datasets.forEach((dataset) => {dataset.data.length = 0})
            this.statCount = 0
        },

        toggleChartDataset(index) {
            this.data.datasets[index].hidden = !this.data.datasets[index].hidden;
            this.renderTriggerKey = !this.renderTriggerKey;
        },

        saveChart() {
            const saveData = Buffer.from(JSON.stringify([
                this.data.labels,
                this.data.datasets.map(dataset => dataset.data)
            ]));

            const chartInfo = {
                beginDate: this.recordBeginDate,
                startTime: this.data.labels[0],
                endTime: this.data.labels[this.data.labels.length - 1]
            }
            
            window.ipc.send('save_chart', chartInfo, saveData);
        },

        handleStat(newStat) {
            console.log(this.statCount)
            if(this.statCount === this.maxStatRecord) {
                this.saveChart();
                this.clearChart();
                this.recordBeginDate = newStat.date            
            }

            // FIX
            else if(this.statCount === 0) {
                this.recordBeginDate = newStat.date     
                console.log(this.recordBeginDate, "a")          
            }
            
            this.data.labels.push(newStat.time)
            this.data.datasets[CURRENT_LISTENER].data = [...this.data.datasets[CURRENT_LISTENER].data, newStat.currentlisteners]
            this.data.datasets[UNIQUE_LISTENERS].data = [...this.data.datasets[UNIQUE_LISTENERS].data, newStat.uniquelisteners]
            this.data.datasets[AVERAGE_TIME].data = [...this.data.datasets[AVERAGE_TIME].data, newStat.averagetime]
            this.renderTriggerKey = !this.renderTriggerKey
            
            this.statCount++;                
        }
    },
}
</script>
<style scoped>
.timeline-container {
    height: calc(100% - 25px);
    width: calc(100% - 15px);
}
</style>