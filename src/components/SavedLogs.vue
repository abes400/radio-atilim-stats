<template>
<div class="card">
    <div class="list-container pin-left">
        <div v-if="files.length == 0" class="list-item">
            <p class="med-title">
                You don't have any saved chart yet. <br><br>
                Click <font-awesome-icon icon="fa-solid fa-download"/> to save your first chart.
            </p>
        </div>
        <div v-for="(file, index) in files" :key="file" class="list-item">
            <div>
                <div>{{file.beginDate}}</div>
                <strong>{{file.startTime}} - {{file.endTime}}</strong>
            </div>
            <div class="pin-right" style="right: 5px">
                <button @click="deleteChart(index)" title="Delete Chart">
                    <font-awesome-icon icon="fa-solid fa-trash"/>
                </button>
                <button @click="openChart(index)" title="Open Chart">
                    <font-awesome-icon icon="fa-solid fa-eye"/>
                </button>
            </div>
        </div>
    </div>
    <div class="right-side pin-right">
        <div class="card-title">
            <div v-if="date" class="pin-left">
                <button
                    style="margin-left: 15px;"
                    v-tooltip.bottom="'Close chart'"
                    @click="closeChart();">
                    <font-awesome-icon icon="fa-solid fa-close"/>
                </button>
                <strong style="padding-left: 5px;">{{ date }}</strong>
            </div>
            <div v-else class="pin-left">
                <strong style="padding-left: 15px;">
                    Select a chart from the left.
                </strong>
            </div>
            <div class="pin-right">
                <button @click="toggleChartDataset(0)" 
                    :disabled="!date"
                    :style="{'border-color': data.datasets[0].hidden ? '#00000000': '#3FB17F'}">
                    Current Listeners
                </button>
                <button @click="toggleChartDataset(1)" 
                    :disabled="!date"
                    :style="{'border-color': data.datasets[1].hidden ? '#00000000' : '#337EC9' }">
                    Unique Listeners
                </button>
                <button @click="toggleChartDataset(2)" 
                    :disabled="!date"
                    :style="{'border-color': data.datasets[2].hidden ? '#00000000' : '#FF9D00'}">
                    Avg. Listen Time
                </button>
            </div> 
        </div>

        <div class="card-content" >
            <div class="timeline-container pop-in pin-right">
                <chart :key="this.renderTriggerKey" :options="this.options" :data="this.data"/>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {Buffer} from 'buffer';
import chartData from '../config/chartData.json'

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

                interaction: { mode: 'index', intersect: false },

                plugins: { legend: { display: false, } }
            },
            data: structuredClone(chartData),
            date: null,
            renderTriggerKey: false,
        }
    },

    mounted() {
        window.ipc.on('update_list', (chartInfo) => {
            this.files.unshift(chartInfo);
        })

        window.ipc.invoke('fetch_list')
            .then((result) => {
                if(result.success) {
                    this.files = result.data;
                }
                // TODO: add else condition handling 
            });
    },

    methods: {
        clearChart() {
            this.data.labels.length = 0
            this.data.datasets.forEach((dataset) => {dataset.data.length = 0})
            this.statCount = 0
        },

        closeChart() {
            this.clearChart();
            this.renderTriggerKey = !this.renderTriggerKey;
            this.date = null;
        },

        toggleChartDataset(index) {
            this.data.datasets[index].hidden = !this.data.datasets[index].hidden;
            this.renderTriggerKey = !this.renderTriggerKey;
        },

        openChart(index) {
            window.ipc.invoke('open_chart', JSON.parse(JSON.stringify(this.files[index])))
                .then((result) => {
                    if(result.success) {
                        this.clearChart();
                        // That's right, I made buffer out of a "buffer", otherwise it wouldn't turn into a string.
                        const newData = JSON.parse(Buffer.from(result.data).toString());
                        this.data.labels = newData[0];
                        newData[1].forEach((dataset, index) => {
                            this.data.datasets[index].data = dataset
                        });
                        this.renderTriggerKey = !this.renderTriggerKey;
                        this.date = this.files[index].beginDate;
                    } 
                    // TODO: add else condition handling 
                })
        },

        deleteChart(index) {
            window.ipc.invoke('delete_chart', JSON.parse(JSON.stringify(this.files[index])))
                .then((result) => {
                    //console.log(result)
                    if(result.success)
                        console.log(this.files.splice(index, 1))
                })
        },
    },
}
</script>

<style scoped>
.list-container {
    height: 100%;
    border-right: solid 1px #282828;
    width: 270px;
}

.timeline-container {
    height: calc(100% - 70px);
    width: calc(100% - 30px);
    right: 15px !important;
}

.right-side {
    width: calc(100% - 270px);
    height: 100%;
}

</style>