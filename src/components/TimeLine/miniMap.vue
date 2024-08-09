<template>
    <div class="small-map">
        <div id="smallMapContainer"></div>
    </div>
</template>

<script>
    export default {
        name: "miniMap",
        data(){
            return{
                smallViewer: null,
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(){

            }
        }
    }
</script>

<style scoped>
    .small-map {
        width: 150px;
        height: 150px;
        position: absolute;
        padding: 10px;
        border-radius: 5px;
        bottom: 110px;
        right: 10px;
        z-index: 100; /* 更高的层级 */
        background-color: rgba(40, 40, 40, 0.7);
    }
    #smallMapContainer{
        width: 100%;
        height: 100%;
    }
</style>
