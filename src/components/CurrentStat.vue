<template>
<div class="card"> 
    <div class="card-title" v-if="stat"><strong>Now Playing: {{stat.songtitle}}</strong></div>

    <div class="card-content" v-if="stat">
        
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

    <div class="card-content" v-else>
        Please wait...
        
    </div>
    
    
</div>
</template>

<script>
export default {
    data() {
        return {
            details: true,
            stat: null,
        }
    },

    mounted() {
        window.ipc.on('new_stat', (new_stat) => {
            this.stat = new_stat;
        })
    }

    /*
    TODO: uniquelisteners
    TODO: peaklisteners
    TODO: maxlisteners
    TODO: averagetime

    TODO: songtitle
    */

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