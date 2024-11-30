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
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const CURRENT_LISTENER = 0


export default {

    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
            },
            data: {
                labels: [],
                datasets:[
                    {
                        label: 'Current Listeners',
                        data:[]
                    }
                ]
            }, 
            renderTriggerKey: false,
        }
    },

    props: {
        loggedStat: Object,
    },

    watch:{
        loggedStat: {
            handler(newStat) {
                this.data.labels.push(newStat.time)
                this.data.datasets[CURRENT_LISTENER].data = [...this.data.datasets[CURRENT_LISTENER].data, newStat.currentlisteners]
                this.renderTriggerKey = !this.renderTriggerKey
            }
        }
    },

    components: {
        Line,
    }

}
</script>