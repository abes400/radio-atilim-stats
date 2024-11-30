<template>
  <div class="card">
    <div class="card-title"><strong>Stat Timeline</strong></div>
    <div class="card-content">
        <Line :key="this.renderTriggerKey" :options="this.options" :data="this.data"/>
    </div>

  </div>
</template>

<script>
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend)

const CURRENT_LISTENER = 0
const UNIQUE_LISTENERS = 1
const AVERAGE_TIME = 2


export default {

    data() {
        return {
            statCount: 0,
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
                    }
                },

                interaction: { mode: 'index' },
                
                plugins: {
                    legend: {onClick: null}
                }
                
            },
            data: {
                labels: [],
                datasets:[
                    {
                        label: 'Current Listeners',
                        type:'line',
                        backgroundColor: '#3FB17F',
                        borderColor: '#329067',
                        pointStyle: false,
                        yAxisID: 'listenerCountAxis',
                        tension: 0.2,
                        data:[]
                    },

                    {
                        label: 'Unique Listeners',
                        type:'line',
                        backgroundColor: '#337EC9',
                        borderColor: '#21578C',
                        pointStyle: false,
                        yAxisID: 'listenerCountAxis',
                        tension: 0.2,
                        data:[]
                    },

                    {
                        label: 'Avg. Listen Time',
                        type: 'bar',
                        backgroundColor: '#6E4621',
                        borderColor: '#BD4A1D',
                        yAxisID: 'listenTimeAxis',
                        data: []
                    }
                ]
            }, 
            renderTriggerKey: false,
        }
    },

    props: {
        loggedStat: Object,
        maxStatRecord: {
            type: Number,
            default: 100,
        }
    },

    methods: {
        clearChart() {
            this.data.labels.length = 0
            this.data.datasets.forEach((dataset) => {dataset.data.length = 0})
            this.statCount = 0
        }
    },

    watch:{
        loggedStat: {
            handler(newStat) {
                if(this.statCount === this.maxStatRecord) {
                    
                    this.clearChart()
                    
                }
                
                this.data.labels.push(newStat.time)
                this.data.datasets[CURRENT_LISTENER].data = [...this.data.datasets[CURRENT_LISTENER].data, newStat.currentlisteners]
                this.data.datasets[UNIQUE_LISTENERS].data = [...this.data.datasets[UNIQUE_LISTENERS].data, newStat.uniquelisteners]
                this.data.datasets[AVERAGE_TIME].data = [...this.data.datasets[AVERAGE_TIME].data, newStat.averagetime]
                this.renderTriggerKey = !this.renderTriggerKey
                
                this.statCount++;                
            }
        }
    },

    components: {
        Line,
    }

}
</script>