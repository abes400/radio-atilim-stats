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

    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            files: [
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                    {date: '11/12/2020', time: '11:30 - 12:20'},
                ]
        }
    },

    mounted() {
        console.log(this.files)
    }

}
</script>

<style>
.list-container {
    height: calc(100% - 80px);
    width: 300px;
}



</style>