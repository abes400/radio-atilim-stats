<template>
<div class="card">
<div class="card-title"><strong>Saved Logs</strong></div>

    <div class="card-content" >

        <div class="list-container pin-left">
            <div v-for="file in files" :key="file" class="list-item">
               <div>{{file.date}}</div>
               <strong>{{file.time}}</strong>
            </div>
        </div>

        <div class="timeline-container pin-right">
            <Line :key="this.renderTriggerKey" :options="this.options" :data="this.data"/>
        </div>

    </div>
</div>
</template>

<script>
import {Line} from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, BarController, Title, Tooltip, Legend)

export default {
    data() {
        return {
            files: [
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '12/12/2020', time: '11:30 - 12:20'},
                    {date: '13/12/2020', time: '11:30 - 12:20'},
                    {date: '14/12/2020', time: '11:30 - 12:20'},
                    {date: '15/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                ],
            
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
                
                plugins: {
                    legend: { onClick: null, }
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
        }
    },

    mounted() {
        console.log(this.files)
    },

    components: {
        Line,
    }

}
</script>

<style>
.list-container {
    height: calc(100% - 80px);
    width: 300px;
}

.timeline-container {
    height: calc(100% - 80px);
    width: calc(100% - 360px);
}

</style>