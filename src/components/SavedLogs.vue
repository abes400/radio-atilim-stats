<template>
<div class="card">
<div class="card-title"><strong>Saved Logs</strong></div>

    <div class="card-content" >

        <div class="list-container pin-left">
            <div v-for="(file, index) in files" :key="file" class="list-item" @click="openChart(index)">
               <div>{{file.beginDate}}</div>
               <strong>{{file.startTime}} - {{file.endTime}}</strong>
            </div>
        </div>

        <div class="timeline-container pop-in pin-right">
            <Line :key="this.renderTriggerKey" :options="this.options" :data="this.data"/>
        </div>

    </div>
</div>
</template>

<script>
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend} from 'chart.js'
import {Buffer} from 'buffer';

import chartData from '../config/chartData.json'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend)

export default {
    data() {
        return {
            files: [],
            
            options: {
                responsive: true,
                maintainAspectRatio: false,

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
            },
            data: chartData,
            renderTriggerKey: false,
        }
    },

    mounted() {
        window.ipc.on('update_list', (chartInfo) => {
            this.files.push(chartInfo);
        })

        window.ipc.invoke('fetch_list')
            .then((result) => {this.files = result;});
    },

    methods: {
        clearChart() {
            this.data.labels.length = 0
            this.data.datasets.forEach((dataset) => {dataset.data.length = 0})
            this.statCount = 0
        },

        openChart(index) {
            window.ipc.invoke('open_chart', JSON.parse(JSON.stringify(this.files[index])))
                .then((result) => {
                    this.clearChart();
                    // That's right, I made buffer out of a "buffer", otherwise it wouldn't turn into a string.
                    const newData = JSON.parse(Buffer.from(result).toString());
                    this.data.labels = newData[0];
                    newData[1].forEach((dataset, index) => {
                        this.data.datasets[index].data = dataset
                    })
                    this.renderTriggerKey = !this.renderTriggerKey
                })
        }
    },

    components: {
        Line,
    }

}
</script>

<style scoped>
.list-container {
    height: calc(100% - 42px);
    border-right: solid 1px #282828;
    width: 330px;
}

.timeline-container {
    height: calc(100% - 70px);
    width: calc(100% - 360px);
    right: 15px !important;
}

</style>