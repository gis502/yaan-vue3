import {ref, reactive, computed} from "vue";

export const useCesiumStore = defineStore('cesium', () => {
        const pointInfo = reactive({
            // lat: null,
            // lon: null,
            // height: null,
            // img: null,
            // type: null,
            // id: null,
            // eqid: null,
            // time: null,
            // name: null,
            // describe: null,
            eqid: null,
            plotid: null,
            time: null,
            plottype: null,
            latitude: null,
            longitude: null,
            height: null,
            img: null,
        })

        function getPointInfo1(){
            return {
                eqid:pointInfo.eqid,
                plotid:pointInfo.plotid,
                plottype:pointInfo.plottype,
                latitude:pointInfo.latitude,
                longitude:pointInfo.longitude,
                height:pointInfo.height,
                img:pointInfo.img,
            }
        }

        function setPointInfo1(info) {
            pointInfo.eqid = info.eqid
            pointInfo.plotid = info.plotid
            pointInfo.plottype = info.plottype
            pointInfo.latitude = info.latitude
            pointInfo.longitude = info.longitude
            pointInfo.height = info.height
            pointInfo.img = info.img
        }


        function clearData(){
            pointInfo.eqid = null
            pointInfo.plotid = null
            pointInfo.plottype = null
            pointInfo.latitude = null
            pointInfo.longitude = null
            pointInfo.height = null
            pointInfo.img = null
        }

        return {pointInfo,getPointInfo1, setPointInfo1, clearData}
    }
)