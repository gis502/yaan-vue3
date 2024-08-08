<template>
  <div class="videoMonitorWin" v-if="visiblePanel" :style="styleObject">
<!--    <div v-if="!showStatus">-->
      <div class="header-div">
        <span>{{ popupPanelData.plotname}}标绘信息</span>
      </div>

      <el-scrollbar height="400px">
          <el-timeline-item>
            <div>
                  <el-descriptions :column="2" size="default " border>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          开始时间
                        </div>
                      </template>
                      <div>
                        <el-text v-if="activity.aditStatus" size="large">{{
                            ("" + activity.starttime).match('-')
                                ? activity.starttime
                                : (activity.starttime !== null ? activity.starttime : "")
                          }}</el-text>

                      </div>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        <div class="cell-item">
                          结束时间
                        </div>
                      </template>
                      <div>
                        <el-text v-if="activity.aditStatus" size="large">{{
                            ("" + activity.endtime).match('-')
                                ? activity.endtime
                                : (activity.endtime !== "" ? activity.endtime : "")
                          }}</el-text>

                      </div>
                    </el-descriptions-item>
                  </el-descriptions>

                  <el-descriptions :column="2" size="default " border>
                    <template v-for="(value,key,index) in activity.info">
                      <el-descriptions-item v-if="value.type ==='text'">
                        <template #label>
                          <div class="cell-item">
                            {{ value.name }}
                          </div>
                        </template>
                        <el-text v-if="activity.aditStatus" size="large" >{{ value.value }}</el-text>
                        <el-input v-if="!activity.aditStatus" v-model="value.value" autocomplete="off" size="large"/>
                      </el-descriptions-item>
                      <el-descriptions-item v-if="value.type ==='select'">
                        <template #label>
                          <div class="cell-item">
                            {{ value.name }}
                          </div>
                        </template>
                        <el-text v-if="activity.aditStatus" size="large">{{ value.value }}</el-text>
                        <el-select v-if="!activity.aditStatus" v-model="value.value" placeholder="" size="large">
                          <el-option
                              v-for="item in value.content"
                              :label="item.lable"
                              :value="item.lable"/>
                        </el-select>
                      </el-descriptions-item>
                    </template>
                  </el-descriptions>
                </div>
          </el-timeline-item>
      </el-scrollbar>
    </div>
</template>
<script>
import {plotType} from '@/cesium/plot/plotType.js'
import {getLastPlotInfoofCurrentTime, getPlotInfos} from '@/api/system/plot.js'
import {getEqbyId} from "@/api/system/eqlist.js";
export default {
  data() {
    return {
      visiblePanel: null,
      positionEntity: {x: 0, y: 0},
      popupPanelData: {}, // 存储这当前标绘点在situationplot表中的信息
      //--------------------
      // showStatus: false,
      plotInfoActivities: [], // 存储当前标绘点的多有situationplotinfo表信息
      activeNames: [], // 对应每个el-collapse-item标签的name，数组中有谁，谁展开。（我使用的index是整型）
      addStatus: false,

      activity: {
        starttime: "",
        endtime: "",
        info: "",
        id: "",
        aditStatus: true,
      }
    }
  },
  props: [
    'popupData', 'position', 'visible', 'currentTime'
  ],
  watch: {
    visible() {
      this.visiblePanel = this.visible
    },
    popupData: {
      deep: true,
      handler() {
        this.popupPanelData = this.popupData
        // 必须把生成对应标绘的html模板代码（下面的for循环），写在watch的popupData中，不能写在visible中。
        // 在执行顺序上，visible比popupData快。导致在判断this.popupPanelData.plottype === plotType[item].name时，
        // popupPanelData是空，判断一定时false，造成第一次点击弹窗无法渲染对应标绘的html模板。
        // 可能时因为开启深度监听的原因（deep: true）。
        // console.log("pannel this.popupPanelData",this.popupPanelData)
        // console.log("currentTime",this.currentTime)

        this.findTime = new Date(this.currentTime.getTime() + 8 * 60 * 60 * 1000);
        // console.log("findTime",this.findTime)

        if (this.visiblePanel) {

          // if(this.popupPanelData.plotid=="center"){
          //   let item = {
          //     starttime: this.timestampToTime(this.popupPanelData.centerPoint.time),
          //     endtime: "",
          //     info: "",
          //     id: "centerinfo",
          //     aditStatus: true,
          //   }
          //   let infostr = `{"name":"震中","position":{"type":"text","name":"位置","value":"${this.popupPanelData.centerPoint.position}"},"latitude":{"type":"text","name":"纬度","value":"${this.popupPanelData.centerPoint.latitude}"},"longitude":{"type":"text","name":"经度","value":"${this.popupPanelData.centerPoint.longitude}"},"magnitude":{"type":"text","name":"震级","value":"${this.popupPanelData.centerPoint.magnitude}"},"depth":{"type":"text","name":"震源深度","value":"${this.popupPanelData.centerPoint.depth}"}}`;
          //   item.info = JSON.parse(infostr)
          //   this.plotInfoActivities.push(item)
          //   console.log(this.plotInfoActivities)
          // }
          // else{
          // this.getLastPlotInfoofCurrentTime(this.popupPanelData.plotid,this.findTime)
          this.getPlotInfo(this.popupPanelData.plotid)
          // }
        }
      }
    },
    position() {
      this.positionEntity = this.position
    },
    currentTime(newVal) {
      this.getActivitiesByTime(newVal);
    }

  },
  computed: {
    // 调整弹框位置
    styleObject() {
      return {
        positionEntity: "absolute",
        left: `${this.positionEntity.x}px`,
        top: `${this.positionEntity.y}px`
      };
    }
  },
  methods: {
    // 点击标绘点后获取此标绘点的所有标绘信息
    getPlotInfo(plotid) {
      this.activity={
        starttime: "",
        endtime: "",
        info: "",
        id: "",
        aditStatus: true,
      }
      // if()
      let that = this
      if(this.popupPanelData.plotid=="center"){
        let item = {
          starttime: this.timestampToTime(this.popupPanelData.centerPoint.time),
          endtime: "",
          info: "",
          id: "centerinfo",
          aditStatus: true,
        }
        let infostr = `{"name":"震中","position":{"type":"text","name":"位置","value":"${this.popupPanelData.centerPoint.position}"},"latitude":{"type":"text","name":"纬度","value":"${this.popupPanelData.centerPoint.latitude}"},"longitude":{"type":"text","name":"经度","value":"${this.popupPanelData.centerPoint.longitude}"},"magnitude":{"type":"text","name":"震级","value":"${this.popupPanelData.centerPoint.magnitude}"},"depth":{"type":"text","name":"震源深度","value":"${this.popupPanelData.centerPoint.depth}"}}`;
        item.info = JSON.parse(infostr)
        // this.plotInfoActivities.push(item)
        // console.log("plotInfoActivities",this.plotInfoActivities)
        // this.getActivitiesByTime(this.currentTime)
        this.activity=item
      }
      else{
        // this.plotInfoActivities = []
        getPlotInfos({plotid}).then(res => {
          this.plotInfoActivities = []
          for (let i = 0; i < res.length; i++) {
            // 这个item一定要写在for循环里面，否则使用push(item)会造成整个plotInfoActivities都是最后一个item
            // 因为push到plotInfoActivities里的是item的地址。（浅拷贝）
            let item = {
              starttime: null,
              endtime: null,
              info: null,
              id: null,
              aditStatus: true,
            }
            item.starttime = that.timestampToTime(res[i].starttime)
            if(res[i].endtime === null){
              item.endtime = ""
            }else{
              item.endtime = that.timestampToTime(res[i].endtime)
            }
            item.info = JSON.parse(res[i].info)
            item.id = res[i].id
            that.plotInfoActivities.push(item)
          }
          console.log(that.plotInfoActivities)
          this.getActivitiesByTime(this.currentTime)
        })
      }

    },
    getActivitiesByTime(currentTime) {
      // 根据当前时间过滤出对应的活动
      console.log(currentTime)
      const activities = this.plotInfoActivities.filter((activity) => {
        console.log(new Date(activity.starttime),currentTime)
        return (
            new Date(activity.starttime) <= currentTime
        );
      });
      console.log("filter",activities)
      // 对活动数据进行排序,时间从早到晚
      activities.sort((a, b) => {
        if (a.starttime < b.starttime) return -1;
        if (a.starttime > b.starttime) return 1;
        return 0;
      });
      console.log("sort",activities)
      // 返回当前时间点前的最后一条信息
      console.log(activities,activities[activities.length-1])
      this.activity=activities[activities.length-1]
    },
    // 时间戳转换成日期格式，将时间戳转换成 xx年xx月xx日xx时xx分xx秒格式，
    // 形参timestamp必须时整型时间戳，字符串类型时间戳得到的时NaN。
    timestampToTime(timestamp) {
      let DateObj = new Date(timestamp)
      // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
      let year = DateObj.getFullYear()
      let month = DateObj.getMonth() + 1
      let day = DateObj.getDate()
      let hh = DateObj.getHours()
      let mm = DateObj.getMinutes()
      let ss = DateObj.getSeconds()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      hh = hh > 9 ? hh : '0' + hh
      mm = mm > 9 ? mm : '0' + mm
      ss = ss > 9 ? ss : '0' + ss
      // return `${year}年${month}月${day}日${hh}时${mm}分${ss}秒`
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },
  }
};
</script>
<style>
.cell-item {
  /*width: 50px;*/
  text-align: center;
}

.collapseFooter {
  float: right;
  margin: 10px;
}

.el-input {
  --el-input-width: 100px !important;
}

.el-select {
  /* 此版本下的select下拉框跟inline属性有bug，当设置inline时，select的宽度会丢失，因此需要手动设置 */
  --el-select-width: 100px !important;
}

.header-div {
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.box-card {
  margin-bottom: 5px;
}

.videoMonitorWin {
  position: absolute;
  width: 800px;
  padding: 20px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
  border: 2px solid #18c9dc;
}

.ponpTitle {
  font-size: 23px;
  text-align: center;
  color: white;
  margin-bottom: 10px;
}

.ponpTable {
  text-align: center;
  color: white;
  margin-bottom: 10px;
}

.ponpTable td {
  padding: 10px;
}

.info-item :nth-child(1) {
  width: 15%;
  border-color: #293966;
  border-top-style: solid;
  border-top-width: 2px;
  background-color: #293966;
  margin-bottom: 2px;
  align-content: center;
}

.info-item :nth-child(2) {
  width: 60%;
  border-color: #4d5469;
  border-top-style: solid;
  border-top-width: 2px;
  background-color: #4d5469;
  margin-bottom: 2px;
}

</style>