<template>
<div class="card"> 
    <div class="card-title">
        <div class="pin-left">
            <button @click="toggleAutoFetch" 
                :style="{'border-color': autoFetch ? '#3FB17F': '#00000000'}">
                Auto
            </button>
        </div> 
        <strong>{{stat.songtitle.length <= 28 ? stat.songtitle : `${stat.songtitle.slice(0, 28)}...`}}</strong>
        <div class="pin-right">
            <button @click="manualFetch" v-if="!autoFetch">
                Refresh
            </button>
        </div> 
    </div>

    <div class="card-content">
        <p>Status</p>
        <div class="primary centered-value">{{stat.currentlisteners}}</div>
        
        <div class="drawer pop-in">
            <button class="drawer-button pin-bottom" @click="details = !this.details">
                <font-awesome-icon v-if="details" icon="fa-solid fa-caret-down" />
                <font-awesome-icon v-else icon="fa-solid fa-caret-up"/>
            </button>
            <div class="drawer-content" v-show="this.details">
                <div class="centered-value">
                    Peak Listeners
                    <div class="secondary"> {{stat.peaklisteners}} </div>
                </div>
                <div class="centered-value">
                    Max. Listeners
                    <div class="secondary"> {{stat.maxlisteners}} </div>
                </div>
                <div class="centered-value">
                    Unique Listeners
                    <div class="secondary"> {{stat.uniquelisteners}} </div>
                </div>
                <div class="centered-value">
                    Avg. Time:
                    <div class="secondary"> {{stat.averagetime}} </div>
                </div>
            </div>
        </div>
        
    </div>    
</div>
</template>

<script>
//28
export default {
    data() {
        return {
            details: true,
            stat: {songtitle: '',
                   currentlisteners: '0',
                   peaklisteners: '0',
                   maxlisteners: '0',
                   uniquelisteners: '0',
                   averagetime: '0',
                },
            autoFetch: true,
        }
    },

    mounted() {
        window.ipc.on('new_stat', (new_stat) => {
            this.stat = new_stat;
        })
    },

    methods: {
        toggleAutoFetch() {
            window.ipc.invoke('toggle_auto')
                .then(result => {
                    this.autoFetch = result;
                })
        },
        manualFetch() {
            window.ipc.send('fetch');
        }
    }
}
</script>

<style scoped>

.centered-value{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
}


.drawer-content{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 10px;
    height: 50px;
    font-size: 7pt;
}

.pop-in{
   padding: 0 ; 
}

</style>