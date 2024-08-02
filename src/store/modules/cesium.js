import {ref, reactive, computed} from "vue";

export const useCesiumStore = defineStore('cesium', () => {
        const pointInfo = reactive({
            eqid: null,
            plotid: null,
            time: null,
            plottype: null,
            latitude: null,
            longitude: null,
            height: null,
            img: null,
        })

        function getPointInfo1() {
            return {
                eqid: pointInfo.eqid,
                plotid: pointInfo.plotid,
                plottype: pointInfo.plottype,
                latitude: pointInfo.latitude,
                longitude: pointInfo.longitude,
                height: pointInfo.height,
                img: pointInfo.img,
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

        function clearData() {
            pointInfo.eqid = null
            pointInfo.plotid = null
            pointInfo.plottype = null
            pointInfo.latitude = null
            pointInfo.longitude = null
            pointInfo.height = null
            pointInfo.img = null
        }

        const polyilneInfo = reactive({
            plottype: null,
            situationPlotData: null
        })

        function getPolyilneInfo() {
            return {
                plottype: polyilneInfo.plottype,
                situationPlotData: polyilneInfo.situationPlotData
            }
        }

        function setPolyilneInfo(info) {
            polyilneInfo.plottype = info.plottype
            polyilneInfo.situationPlotData = info.situationPlotData
        }

        function clearPolyilneInfo() {
            polyilneInfo.plottype = null
            polyilneInfo.situationPlotData = null
        }

        return {
            pointInfo,
            getPointInfo1,
            setPointInfo1,
            clearData,
            getPolyilneInfo,
            setPolyilneInfo,
            clearPolyilneInfo
        }
    }
)