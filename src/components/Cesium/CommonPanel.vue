<template>
  <div class="videoMonitorWin" v-if="visiblePanel" :style="styleObject">
    <div v-if="!showStatus">
      <div class="header-div">
        <span>标绘信息时间轴</span>
        <span>
          <el-button type="danger" @click="deletePlot">删除</el-button>
          <el-button type="primary" @click="addPlotInfo">新增时间轴</el-button>
        </span>
      </div>
      <el-scrollbar height="400px">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in plotInfoActivities" :key="index">
            <el-collapse v-model="activeNames" @change="">
              <el-collapse-item :name="index">
                <template #title>
                  <div>
                    <!--此处首先判断starttime是日期形式还是时间戳形式；前者则直接显示；后者则再判断是否为null，不是null则把时间戳转成日期形式，是null则为空-->
                    <!--用来解决新增时下面的span显示时间戳的问题-->
                    <span style="margin-left: 10px;font-size: 16px">
                      {{("" + activity.starttime).match('-')
                            ? activity.starttime
                            : (activity.starttime !== null ? activity.starttime : "") }}
                    </span>
                    <!--                    <span style="margin-left: 20px">自定义内容 </span>-->
                  </div>
                </template>
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
                        <el-date-picker
                            v-if="!activity.aditStatus"
                            v-model="activity.starttime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="x"
                            size="large">
                        </el-date-picker>
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
                        <el-date-picker
                            v-if="!activity.aditStatus"
                            v-model="activity.endtime"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="x"
                            size="large">
                        </el-date-picker>
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
                <div class="collapseFooter">
                  <el-button v-if="!activity.aditStatus && addStatus" type="success" round
                             @click="addCommitPlotInfo(activity)">新增
                  </el-button>
                  <el-button v-if="activity.aditStatus && !addStatus" type="warning" round
                             @click="beforeUpdataPlotInfo(activity)">修改
                  </el-button>
                  <el-button v-if="!activity.aditStatus && !addStatus" type="success" round
                             @click="updataPlotInfo(activity)">提交
                  </el-button>
                  <el-button v-if="activity.aditStatus && !addStatus" type="danger" round
                             @click="deletePlotInfo(activity)">删除
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
    <!--    <div v-if="showStatus" class="scrollbar-demo-item">-->
    <!--      <div class="ponpTitle">信息面板</div>-->
    <!--      <table class="ponpTable">-->
    <!--        <tbody>-->
    <!--        <tr class="info-item">-->
    <!--          <td>标注类型</td>-->
    <!--          <td>{{ this.popupPanelData.type }}</td>-->
    <!--        </tr>-->
    <!--        <tr class="info-item">-->
    <!--          <td>时间</td>-->
    <!--          <td>{{ this.popupPanelData.time }}</td>-->
    <!--        </tr>-->
    <!--        <tr class="info-item">-->
    <!--          <td>名称</td>-->
    <!--          <td>{{ this.popupPanelData.name }}</td>-->
    <!--        </tr>-->
    <!--        <tr class="info-item">-->
    <!--          <td>经度</td>-->
    <!--          <td>{{ this.popupPanelData.lon }}</td>-->
    <!--        </tr>-->
    <!--        <tr class="info-item">-->
    <!--          <td>纬度</td>-->
    <!--          <td>{{ this.popupPanelData.lat }}</td>-->
    <!--        </tr>-->
    <!--        <tr class="info-item">-->
    <!--          <td>描述</td>-->
    <!--          <td style="text-align: left;">{{ this.popupPanelData.describe }}</td>-->
    <!--        </tr>-->
    <!--        </tbody>-->
    <!--      </table>-->
    <!--      <el-button @click="showStatus = !showStatus" type="warning">返回</el-button>-->
    <!--      <el-button @click="deletePoint" type="danger">删除</el-button>-->
    <!--    </div>-->

  </div>
</template>
<script>
import {Delete, Edit} from '@element-plus/icons-vue'
import {plotType} from '@/cesium/plot/plotType.js'
import {getPlotInfos, addPlotInfo, deletePlotAndInfo, deletePlotInfo, updataPlotInfo} from '@/api/system/plot.js'

export default {
  data() {
    return {
      visiblePanel: null,
      positionEntity: {x: 0, y: 0},
      popupPanelData: {}, // 存储这当前标绘点在situationplot表中的信息
      //--------------------
      showStatus: false,
      plotInfoActivities: [], // 存储当前标绘点的多有situationplotinfo表信息
      activeNames: [], // 对应每个el-collapse-item标签的name，数组中有谁，谁展开。（我使用的index是整型）
      addStatus: false
    }
  },
  props: [
    'popupData', 'position', 'visible'
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
        if (this.visiblePanel) {
          console.log(this.popupPanelData,1222)
          this.getPlotInfo(this.popupPanelData.plotid)
        }
      }
    },
    position() {
      this.positionEntity = this.position
    },
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
    // 标绘信息修改按钮
    beforeUpdataPlotInfo(activity){
      activity.aditStatus = !activity.aditStatus
      // 把做时间戳转换成yyyy-mm-dd hh:mm:ss格式，这样在修改界面的el-date-picker就不会显示时间轴了
      // 然后在updataPlotInfo中提交时再把yyyy-mm-dd hh:mm:ss格式转成时间轴存库
      activity.starttime = this.timestampToTime(activity.starttime)//new Date(activity.starttime).getTime();
      activity.endtime = this.timestampToTime(activity.endtime)//new Date(activity.endtime).getTime();
    },
    // 提交修改的标绘信息
    updataPlotInfo(activity) {
      let that = this
      activity.aditStatus = !activity.aditStatus
      let data = {
        // plotid: this.popupPanelData.plotid,
        starttime: new Date(activity.starttime).getTime(),//转成时间轴
        endtime: new Date(activity.endtime).getTime(),//转成时间轴
        info: JSON.stringify(activity.info),
        id: activity.id
      }
      updataPlotInfo(data).then(res => {
        that.getPlotInfo(that.popupPanelData.plotid)
      })
    },
    // 删除标绘信息
    deletePlotInfo(activity) {
      let id = activity.id
      let that = this
      deletePlotInfo({id}).then(res => {
        that.getPlotInfo(that.popupPanelData.plotid)
      })
    },
    // 删除标绘点
    deletePlot() {
      let plotid = this.popupPanelData.plotid
      deletePlotAndInfo({plotid}).then(res => {
        window.viewer.entities.removeById(plotid)
        this.$emit('closePlotPop')
      })
    },
    // 打开添加标绘信息
    addPlotInfo() {
      this.addStatus = !this.addStatus
      let data = {
        starttime: null,
        endtime: null,
        info: null,
        aditStatus: false,
        id: this.guid()
      }
      for (let item in plotType) {
        if (this.popupPanelData.plottype === plotType[item].name) {
          // 深拷贝
          data.info = JSON.parse(JSON.stringify(plotType[item]))
          break;
        }
      }
      this.plotInfoActivities.push(data)
      // 使新增的折叠面板处于打开状态
      this.activeNames[0] = this.plotInfoActivities.length - 1
    },
    // 提交添加标绘信息
    addCommitPlotInfo(activity) {
      let that = this
      activity.aditStatus = !activity.aditStatus
      let data = {
        plotid: this.popupPanelData.plotid,
        starttime: activity.starttime,
        endtime: activity.endtime,
        info: JSON.stringify(activity.info),
        id: activity.id
      }
      addPlotInfo(data).then(res => {
        that.getPlotInfo(that.popupPanelData.plotid)
        that.addStatus = !this.addStatus
      })
    },
    // 点击标绘点后获取此标绘点的所有标绘信息
    getPlotInfo(plotid) {
      let that = this
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
      })
    },
    // 删除标注
    deletePoint() {
      this.$emit('closePlotPop')
      this.$emit('wsSendPoint', JSON.stringify({type: "point", operate: "delete", id: window.selectedEntity.id}))
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
    // 生成uuid
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
};
</script>
<style>
.el-descriptions__body .el-descriptions__table.is-bordered .el-descriptions__cell{
  /*width: 43px!important;*/
}
.cell-item {
  width: 60px;
  text-align: center;
}

.collapseFooter {
  float: right;
  margin: 10px;
}

.el-input {
  --el-input-width: 140px !important;
}

.el-select {
  /* 此版本下的select下拉框跟inline属性有bug，当设置inline时，select的宽度会丢失，因此需要手动设置 */
  --el-select-width: 140px !important;
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
