<template>
<div class="card"> 
    <div class="card-title" v-if="stat"><strong>Now Playing: {{stat.songtitle}}</strong></div>

    <div class="card-content" v-if="stat">
        
        <div class="primary-value">{{stat.currentlisteners}}</div>
        

        <div class="drawer">
            <button class="drawer-button pin-bottom" @click="details = !this.details">
                <font-awesome-icon v-if="details" icon="fa-solid fa-caret-down" />
                <font-awesome-icon v-else icon="fa-solid fa-caret-up"/>
            </button>
            <div class="drawer-content" v-show="this.details">
                <table>
                    <tr>
                        <td><strong>Peak Listeners:</strong></td>
                        <td>{{stat.peaklisteners}}</td>
                        <td><strong>Max Listeners:</strong></td>
                        <td>{{stat.maxlisteners}}</td> 
                           
                    </tr>
                    <tr>
                        <td><strong>Unique Listeners:</strong></td>
                        <td>{{stat.uniquelisteners}}</td>
                        <td><strong>Avg. Time:</strong></td>
                        <td>{{stat.averagetime}}</td>
                    </tr>
                </table>
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

<style>
.card{
    width: 100%;
    height: 100%;
}

.primary-value{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.card-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.drawer-content{
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 50px;
    font-size: 10pt;
}

</style>