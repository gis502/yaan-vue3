import {ref, reactive, computed} from "vue";

export const useCesiumStore = defineStore('cesium', () => {
        const pointInfo = reactive({
            lat: null,
            lon: null,
            height: null,
            img: null,
            type: null,
            id: null,
            eqid: null,
            time: null,
            name: null,
            describe: null,
        })

        function getPointInfo1(){
            return {
                lat:pointInfo.lat,
                lon:pointInfo.lon,
                height:pointInfo.height,
                img:pointInfo.img,
                type:pointInfo.type,
                id:pointInfo.id,
                eqid:pointInfo.eqid
            }
        }

        function setPointInfo1(info) {
            pointInfo.lat = info.lat
            pointInfo.lon = info.lon
            pointInfo.height = info.height
            pointInfo.img = info.img
            pointInfo.type = info.type
            pointInfo.id = info.id
            pointInfo.eqid = info.eqid
        }

        function setPointInfo2(info) {
            pointInfo.eqid = info.eqid
            pointInfo.time = info.time
        }

        function clearData(){
            pointInfo.lat = null
            pointInfo.lon = null
            pointInfo.height = null
            pointInfo.img = null
            pointInfo.type = null
            pointInfo.id = null
            pointInfo.eqid = null
        }

        return {pointInfo,getPointInfo1, setPointInfo1, clearData}
    }
)