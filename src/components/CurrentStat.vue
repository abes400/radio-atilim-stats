<template>
<div class="card"> 
    <div class="card-title">
        <div class="pin-left">
            <button 
                @click="toggleAutoFetch" 
                :style="{'border-color': autoFetch ? '#3FB17F': '#00000000'}"
                v-tooltip.bottom-start="'When enabled, it updates the current stat automatically.'">
                Auto
            </button>
        </div> 

        <div class="song-info-container" v-tooltip.bottom="'Double-click to listen'" @dblclick="listenNow">
            <div>
                <Vue3Marquee :animate-on-overflow-only="true" :pause-on-hover="true">
                    <strong class="title"> &#8205; &#8205; {{ stat.songtitle }}  &#8205; &#8205; </strong>
                </Vue3Marquee>
            </div>
            <div>
                <Vue3Marquee :animate-on-overflow-only="true" :pause-on-hover="true">
                    <div class="title mini-title"> &#8205; &#8205; {{ stat.songartist }} &#8205; &#8205; </div>
                </Vue3Marquee>
            </div>
        </div>

        <div class="pin-right">
            <button 
                @click="manualFetch"
                v-tooltip.bottom="'Update the Current Stat'"
                v-if="!autoFetch">
                <font-awesome-icon icon="fa-solid fa-refresh"/>
            </button>
        </div> 
    </div>

    <div class="card-content">

        <p class="mini-title">Current Listeners</p>
        <div class="primary centered-value">
            {{stat.currentlisteners}}
        </div>
        
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
export default {
    data() {
        return {
            details: true,
            stat: {songtitle: 'Connecting...',
                   songartist: 'Please wait...',
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
            if(new_stat.success)
                this.stat = new_stat;
            else {
                this.stat.songtitle = "Connection lost - Trying again..."
                this.stat.songartist = "Last fetch can be seen below:"
            }
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
        },
        listenNow() {
            window.ipc.send('listen');
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

.pop-in{ padding: 0 ; }

.song-info-container {
    width: calc(100% - 125px);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title { text-align: center; }

</style>