<template>
  <div>
    <!--    title-->
    <div class="eqtitle">
      <span class="eqtitle-text_eqname">{{this.eqyear}}年{{this.eqmonth}}月{{this.eqday}}日{{this.centerPoint.position}}{{this.centerPoint.magnitude}}级地震</span>
    </div>
    <!--    title end-->

    <!--    box包裹地图，截图需要-->
    <div id="box" ref="box">
      <div id="cesiumContainer">
        <!--        图例-->
        <!--      <div class="legend">-->
        <!--        <img src="../../assets/images/TimeLine/legend.png" style="width: 23%;height: 23%">-->
        <!--      </div>-->
        <!--        图例 end-->
        <!--          面板信息-->
        <TimeLinePanel
            :visible="popupVisible"
            :position="popupPosition"
            :popupData="popupData"
            :currentTime="currentTime"
        />
      </div>
    </div>

    <!-- 进度条-->
    <div class="bottom">
      <!--      播放暂停按钮-->
      <div class="play">
        <img class="play-icon" src="../../../assets/icons/TimeLine/播放.png" v-if="!isTimerRunning"
             @click="toggleTimer"/>
        <img class="pause-icon" src="../../../assets/icons/TimeLine/暂停.png" v-if="isTimerRunning"
             @click="toggleTimer"/>
      </div>

      <div class="time-ruler" @mousedown="startDrag" @mouseenter="isDragging = true" @mouseleave="isDragging = true">
        <div class="time-ruler-line" @click="jumpToTime">
          <div class="time-progress" :style="{ width: `${currentTimePosition}%` }"></div>
          <div class="time-slider" :style="{ left: `${currentTimePosition-0.5}%` }"></div>
        </div>
      </div>

      <!--      时间点-->
      <div class="current-time-info">
        <span class="timelabel">{{ this.timestampToTime(this.currentTime) }}</span>
      </div>
      <div class="end-time-info">
        <div class="timelabel">{{ this.timestampToTime(this.eqendTime) }}</div>
      </div>
    </div>
    <!-- 进度条 end-->

<!--    两侧组件-->

<!--新闻-->
<!--    <timeLineNewsCard class="news" width="35rem">-->
<!--      <div>-->
<!--        <h2 class="sub-title">-->
<!--          最新事件:-->
<!--&lt;!&ndash;          <span class="m-time">{{ speakers.time }}</span>&ndash;&gt;-->
<!--        </h2>-->
<!--      </div>-->
<!--    </timeLineNewsCard>-->
<!--新闻 end-->




      <timeLineEmergencyResponse
          :currentTime="currentTime"
      />

      <timeLinePersonnelCasualties
          :currentTime="currentTime"
      />


    <div class="rescue_team">
      <timeLineRescueTeam/>
    </div>

    <div class="news">
      <timeLineNews/>
    </div>

    <div class="smallmap">
      <timeLineSmallMap/>
    </div>
<!--    两侧组件 end-->
    <!--报告产出按钮-->
    <div class="button-container">
      <el-button class="el-button--primary" size="small" @click="takeScreenshot">报告产出</el-button>
    </div>
    <!--报告产出按钮 end-->


  </div>


</template>

<script>
import * as Cesium from 'cesium'
import CesiumNavigation from "cesium-navigation-es6";
import {initCesium} from '@/cesium/tool/initCesium.js'
import {getPlotwithStartandEndTime} from '@/api/system/plot'
import {getAllEq, getEqbyId} from '@/api/system/eqlist'
import cesiumPlot from '@/cesium/plot/cesiumPlot'

import centerstar from "@/assets/icons/TimeLine/震中.png";
import TimeLinePanel from "@/components/Cesium/TimeLinePanel.vue";

import timeLineNews from "@/components/TimeLine/timeLineNews.vue"
import timeLineEmergencyResponse from "@/components/TimeLine/timeLineEmergencyResponse.vue"
import timeLinePersonnelCasualties from "@/components/TimeLine/timeLinePersonnelCasualties.vue"

//报告产出
import jsPDF from "jspdf";
import "../../../api/SimHei-normal.js";
import html2canvas from "html2canvas";
// import canvas2image from 'canvas2image';

export default {
  components: {
    TimeLinePanel,
    timeLineNews,
    timeLineEmergencyResponse,
    timeLinePersonnelCasualties
  },
  data: function () {
    return {
      //-----------标绘点弹窗-------------
      selectedEntityHighDiy: null,
      popupPosition: {x: 0, y: 0}, // 弹窗显示位置，传值给子组件
      popupVisible: false, // 弹窗的显示与隐藏，传值给子组件
      popupData: {}, // 弹窗内容，传值给子组件

      //-地震列表---------------------------------
      total: 0,
      pageSize: 6,
      currentPage: 1,
      getEqData: [],
      tableData: [],
      //----------------------------------
      eqid: '',
      viewer: '',
      store: '',
      //地震时间年月日
      eqyear: '',
      eqmonth: '',
      eqday: '',

      // 震中点数据结构
      centerPoint: {
        plotid: 'center',
        position: '',
        // time:'',
        starttime: '',
        endtime: '',
        magnitude: '',
        longitude: '',
        latitude: '',
        height: '',
        depth: '',
        plottype: '震中'
      },


      //时间轴时间
      eqstartTime: '',
      currentTime: '',
      eqendTime: '',
      //时间轴当前时间
      currentTimePosition: 0,
      //时间轴当前前进步
      currentNodeIndex: 1,
      intervalId: null,

      //是否记载到view上，已经存在则不再添加
      plotisshow: {},
      //包括最早出现时间，最晚结束时间的标绘点信息
      plots: [],
      //时间轴暂停播放状态
      isTimerRunning: true,
      //时间轴拖拽
      isDragging: false,
      dragStartX: 0,

    };
  },
  created() {
    this.eqid = this.$route.params.eqid
  },
  mounted() {
    // this.init()
    this.getEqInfo(this.eqid)
    this.initTimerLine()
    // ---------------------------------------------------
    // 生成实体点击事件的handler
    // this.entitiesClickPonpHandler()
    // this.watchTerrainProviderChanged()

  },
  // destroyed() {
  //   // this.websock.close()
  // },
  methods: {
    // 初始化控件等
    init() {
      console.log(this.eqid)
      let viewer = initCesium(Cesium)
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
      window.viewer = viewer
      let options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      // options.defaultResetView = Cesium.Cartographic.fromDegrees(103.00, 29.98, 1000, new Cesium.Cartographic)
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true
      options.resetTooltip = "重置视图";
      options.zoomInTooltip = "放大";
      options.zoomOutTooltip = "缩小";
      //新版必须new  CesiumNavigation ,可以查看作者github
      window.navigation = new CesiumNavigation(viewer, options)
      document.getElementsByClassName('cesium-geocoder-input')[0].placeholder = '请输入地名进行搜索'
      document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[0].innerHTML = '影像服务'
      document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[1].innerHTML = '地形服务'
    },
    // /取地震信息+开始结束当前时间初始化
    getEqInfo(eqid){
      getEqbyId({eqid:eqid}).then(res => {
        //震中标绘点
        this.centerPoint=res
        this.centerPoint.plotid = "center"
        this.centerPoint.starttime = new Date(res.time)
        this.centerPoint.endtime = new Date(res.time + (7 * 24 * 60 * 60 * 1000 + 1000));

        //变量初始化
        this.eqstartTime = this.centerPoint.starttime
        this.eqyear = this.eqstartTime.getFullYear()
        this.eqmonth = this.eqstartTime.getMonth() + 1
        this.eqday = this.eqstartTime.getDate()
        // 计算结束时间 结束时间为开始后72小时，单位为毫秒
        this.eqendTime = new Date(this.eqstartTime.getTime() + (7 * 24 * 60 * 60 * 1000));
        this.currentTime = this.eqstartTime

        // this.updateMapandVariablebeforInit()

      })
    },
    // 获取地震列表、以及最新地震的eqid、并渲染已有的标绘
    // getEq() {
    //   // console.log(this.eqid)
    //   let that = this
    //   getAllEq().then(res => {
    //     let data = []
    //     for (let i = 0; i < res.length; i++) {
    //       let item = res[i]
    //       item.time = that.timestampToTime(res[i].time)
    //       data.push(item)
    //     }
    //     that.getEqData = data
    //     that.total = res.length
    //     that.tableData = that.getPageArr()
    //     //当前地震
    //     that.eqid = that.tableData[0].eqid
    //     //震中标绘点
    //     this.centerPoint = that.tableData[0]
    //     this.centerPoint.plotid = "center"
    //     this.centerPoint.starttime = new Date(that.tableData[0].time)
    //     this.centerPoint.endtime = new Date(that.tableData[0].time + (7 * 24 * 60 * 60 * 1000 + 1000));
    //
    //     //变量初始化
    //     this.eqstartTime = this.centerPoint.starttime
    //     this.eqyear = this.eqstartTime.getFullYear()
    //     this.eqmonth = this.eqstartTime.getMonth() + 1
    //     this.eqday = this.eqstartTime.getDate()
    //     // 计算结束时间 结束时间为开始后72小时，单位为毫秒
    //     this.eqendTime = new Date(this.eqstartTime.getTime() + (7 * 24 * 60 * 60 * 1000));
    //     this.currentTime = this.eqstartTime
    //
    //     this.updateMapandVariablebeforInit()
    //   })
    // },
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
    // 切换地震，获取震中信息，切换地震地图视角
    // plotAdj(row) {
    //   this.stopTimer();
    //   this.isTimerRunning = false
    //   this.currentTimePosition = 0
    //   this.currentNodeIndex = 0
    //
    //   window.viewer.entities.removeAll();
    //   this.eqid = row.eqid
    //   getEqbyId({eqid: this.eqid}).then(res => {
    //     this.centerPoint = res
    //     this.centerPoint.plotid = "center"
    //     this.centerPoint.starttime = new Date(res.time)
    //     this.centerPoint.endtime = new Date(res.time + (7 * 24 * 60 * 60 * 1000 + 1000));
    //
    //     //变量初始化
    //     this.eqstartTime = this.centerPoint.starttime
    //     this.eqyear = this.eqstartTime.getFullYear()
    //     this.eqmonth = this.eqstartTime.getMonth() + 1
    //     this.eqday = this.eqstartTime.getDate()
    //     // 计算结束时间 结束时间为开始后72小时，单位为毫秒
    //     this.eqendTime = new Date(this.eqstartTime.getTime() + (7 * 24 * 60 * 60 * 1000));
    //     this.currentTime = this.eqstartTime
    //
    //     this.updateMapandVariablebeforInit()
    //   })
    // },

    //更新地图中心视角，更新变量：地震起止时间，渲染点
    updateMapandVariablebeforInit() {
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            parseFloat(this.centerPoint.longitude),
            parseFloat(this.centerPoint.latitude),
            150000),
        orientation: {
          // 指向
          heading: 6.283185307179581,
          // 视角
          pitch: -1.5688168484696687,
          roll: 0.0
        }
      });
      //加载中心点
      viewer.entities.add({
        // properties: {
        //   type: "震中",
        //   time: this.centerPoint.time,
        //   name: this.centerPoint.position,
        //   lat: this.centerPoint.latitude,
        //   lon: this.centerPoint.longitude,
        //   describe: this.centerPoint.position,
        // },
        position: Cesium.Cartesian3.fromDegrees(
            parseFloat(this.centerPoint.longitude),
            parseFloat(this.centerPoint.latitude),
            parseFloat(this.centerPoint.height || 0)
        ),
        billboard: {
          image: centerstar,
          width: 50,
          height: 50,
        },
        label: {
          text: this.centerPoint.position,
          show: true,
          font: '14px sans-serif',
          fillColor: Cesium.Color.RED,        //字体颜色
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -16),
        },
        id: this.centerPoint.plotid,
        plottype: "震中",
      });

      //获取渲染点
      this.getPlotwithStartandEndTime(this.eqid)
    },
    //取标绘点
    getPlotwithStartandEndTime(eqid) {
      getPlotwithStartandEndTime({eqid: eqid}).then(res => {
        this.plots = res
        console.log(res)
        res.forEach(item => {
          if (!item.endtime) {
            item.endtime = new Date(this.eqendTime.getTime() + 5000);
          }
          this.plotisshow[item.plotid] = 0
        })
        //开启时间轴
        this.initTimerLine();
      })
    },

    //时间轴操作
    initTimerLine() {
      this.isTimerRunning = true
      // if(this.currentTimePosition >= 100 || this.currentTimePosition==0) {
      //   //归零
      //   viewer.entities.removeAll();
      //   this.currentNodeIndex=0;
      //   this.currentTime=this.eqstartTime;
      //   this.currentTimePosition=0;
      //   this.currentTimePointPosition= this.currentNodeIndex-0.5
      //   //加载中心点
      //   viewer.entities.add({
      //     // properties: {
      //     //   type: "震中",
      //     //   time: this.centerPoint.time,
      //     //   name: this.centerPoint.position,
      //     //   lat: this.centerPoint.latitude,
      //     //   lon: this.centerPoint.longitude,
      //     //   describe: this.centerPoint.position,
      //     // },
      //     position: Cesium.Cartesian3.fromDegrees(
      //         parseFloat(this.centerPoint.longitude),
      //         parseFloat(this.centerPoint.latitude),
      //         parseFloat(this.centerPoint.height || 0)
      //     ),
      //     billboard: {
      //       image: centerstar,
      //       width: 50,
      //       height: 50,
      //     },
      //     label: {
      //       text: this.centerPoint.position,
      //       show: true,
      //       font: '14px sans-serif',
      //       fillColor:Cesium.Color.RED,        //字体颜色
      //       style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //       outlineWidth: 2,
      //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //       pixelOffset: new Cesium.Cartesian2(0, -16),
      //     },
      //     id:this.centerPoint.plotid,
      //     plottype:"震中",
      //   });
      // }
      //时间轴开始
      this.intervalId = setInterval(() => {
        this.updateCurrentTime();
      }, 160);
    },
    updateCurrentTime() {
      this.currentNodeIndex = (this.currentNodeIndex + 1) % 672  //共前进672次，每次15分钟
      let tmp = 100.0 / 672.0  //进度条每次前进
      this.currentTimePosition += tmp;
      if (this.currentTimePosition >= 100) {
        this.currentTimePosition = 100;
        this.currentTime = this.eqendTime
        this.stopTimer();
        this.isTimerRunning = false
      } else {
        this.currentTimePosition = this.currentTimePosition % 100
        // this.currentTime = new Date(this.eqstartTime.getTime() + (7 * 24 * 60 * 60 * 1000));
        this.currentTime = new Date(this.eqstartTime.getTime() + this.currentNodeIndex * 15 * 60 * 1000);
        // this.updatePlot()
      }
    },
    updatePlot() {
      //添加
      let pointArr = this.plots.filter(e => e.drawtype === 'point')
      // console.log(pointArr)
      pointArr.forEach(item => {
        const currentDate = new Date(this.currentTime);
        const startDate = new Date(item.starttime);
        const endDate = new Date(item.endtime);
        // console.log(item.plotid,startDate,endDate,currentDate)
        if (startDate <= currentDate && endDate >= currentDate && this.plotisshow[item.plotid] === 0) {
          this.plotisshow[item.plotid] = 1
          // console.log(item.plotid,"add")
          viewer.entities.add({
            // properties: {
            //   id: item.plotid,
            //   // type: item.drawtype,
            //   // // time: item.timestamp,
            //   // // name: item.pointname,
            //   // lat: item.latitude,
            //   // lon: item.longitude,
            //   // describe: item.pointdescribe,
            // },
            position: Cesium.Cartesian3.fromDegrees(
                parseFloat(item.longitude),
                parseFloat(item.latitude),
                parseFloat(item.height || 0)
            ),
            billboard: {
              image: item.img,
              width: 30,
              height: 30,
            },
            // label: {
            //   text: item.pointname,
            //   show: true,
            //   font: '14px sans-serif',
            //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            //   outlineWidth: 2,
            //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            //   pixelOffset: new Cesium.Cartesian2(0, -16),
            // },
            id: item.plotid,
            plottype: item.plottype,
          });
        }
        //消失
        if ((endDate <= currentDate || startDate > currentDate) && this.plotisshow[item.plotid] === 1) {
          this.plotisshow[item.plotid] = 0
          // console.log(item.plotid,"end")
          viewer.entities.removeById(item.plotid)
        }
      });
    },
    //时间轴停止
    stopTimer() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isTimerRunning = false
      // console.log("stopTimer")
    },
    //暂停播放切换
    toggleTimer() {
      if (this.isTimerRunning) {
        this.stopTimer();
        // this.isTimerRunning = false;
      } else {
        // this.isTimerRunning=true
        this.initTimerLine();
      }
    },
    //点击跳转时间对应场景
    jumpToTime(event) {
      const timeRulerRect = event.target.closest('.time-ruler').getBoundingClientRect();
      const clickedPosition = event.clientX - timeRulerRect.left;
      this.currentTimePosition = (clickedPosition / timeRulerRect.width) * 100;
      this.$el.querySelector('.time-progress').style.width = `${this.currentTimePosition}%`;
      this.currentNodeIndex = Math.floor((this.currentTimePosition / 100) * 672); // Assuming 672 is the total number of steps
      this.currentTime = new Date(this.eqstartTime.getTime() + this.currentNodeIndex * 15 * 60 * 1000);
      //点击前运行状态
      this.updatePlot();
    },
    //时间轴拖拽
    startDrag(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      document.addEventListener('mousemove', this.drag);
      document.addEventListener('mouseup', this.stopDrag);
      // 添加禁用选择的 CSS 样式
      document.body.style.userSelect = 'none';
      document.body.style.WebkitUserSelect = 'none';
      document.body.style.MozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';

    },
    drag(event) {
      if (!this.isDragging) return;
      const timeRulerRect = this.$el.querySelector('.time-ruler').getBoundingClientRect();
      const clickedPosition = Math.max(timeRulerRect.left, Math.min(event.clientX, timeRulerRect.right)) - timeRulerRect.left;
      const newPosition = (clickedPosition / timeRulerRect.width) * 100;
      this.currentTimePosition = newPosition;
      this.currentNodeIndex = Math.floor((this.currentTimePosition / 100) * 672);
      this.currentTime = new Date(this.eqstartTime.getTime() + this.currentNodeIndex * 15 * 60 * 1000);
      this.$el.querySelector('.time-progress').style.width = `${newPosition}%`;
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.drag);
      document.removeEventListener('mouseup', this.stopDrag);
      this.updatePlot();
      // 恢复默认的选择行为
      document.body.style.userSelect = 'auto';
      document.body.style.WebkitUserSelect = 'auto';
      document.body.style.MozUserSelect = 'auto';
      document.body.style.msUserSelect = 'auto';
    },
    //时间轴end-------------


    // 所有entity实体类型点击事件的handler（billboard、polyline、polygon）
    entitiesClickPonpHandler() {
      let that = this
      window.viewer.screenSpaceEventHandler.setInputAction(async (click) => {
        // 1-1 获取点击点的信息（包括）
        let pickedEntity = window.viewer.scene.pick(click.position);
        window.selectedEntity = pickedEntity?.id
        // 2-1 判断点击物体是否为点实体（billboard）
        if (Cesium.defined(pickedEntity) && window.selectedEntity !== undefined && window.selectedEntity._billboard !== undefined) {
          // 2-2 获取点击点的经纬度
          let ray = viewer.camera.getPickRay(click.position)
          let position = viewer.scene.globe.pick(ray, viewer.scene)
          // 2-3 将笛卡尔坐标转换为地理坐标角度,再将地理坐标角度换为弧度
          let cartographic = Cesium.Cartographic.fromCartesian(position);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);

          // 2-4-1 将经纬度和高度生成新的笛卡尔坐标，用来解决弹窗偏移（不加载地形的情况）
          let height = 0
          that.selectedEntityHighDiy = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);// 这种可以存data吗？？？？？？？？？？？？？？？
          // 2-4-2 加载地形时，构建虚拟的已添加实体，让弹窗定位到虚拟的实体上
          if (this.isTerrainLoaded()) {
            const cesiumPosition = window.selectedEntity.position.getValue(window.viewer.clock.currentTime);//获取时间？？？？？？？？？？？？
            let l = Cesium.Cartographic.fromCartesian(position)
            let lon = Cesium.Math.toDegrees(l.longitude)
            let lat = Cesium.Math.toDegrees(l.latitude)
            let hei = l.height
            let height
            // 将笛卡尔坐标转换为地理坐标角度
            let cartographic = Cesium.Cartographic.fromCartesian(position);
            // 将地理坐标角度换为弧度
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            height = window.viewer.scene.globe.getHeight(cartographic) // 获取当前位置的高度
            // 将经纬度和高度生成新的笛卡尔坐标
            that.selectedEntityHighDiy = Cesium.Cartesian3.fromDegrees(Number(longitude.toFixed(6)), Number(latitude.toFixed(6)), height);
            // console.log("虚拟位置",{longitude, latitude, height},"真实位置",{lon,lat,hei})
          }
          // 2-5 更新弹窗位置
          // that.selectedEntity = window.selectedEntity
          that.popupData = {
            plotid: window.selectedEntity.id,
            plotname: window.selectedEntity.plottype,
            centerPoint: that.centerPoint
          };
          // that.currentTime=
          this.popupVisible = true; // 显示弹窗
          this.updatePopupPosition(); // 更新弹窗的位置
        } else {
          this.popupVisible = false; // 隐藏弹窗
        }
        // 3-1 选中面时触发
        if (Cesium.defined(pickedEntity) && window.selectedEntity._polygon !== undefined) {
          that.showPolygon = true
          // that.polygonPosition = window.selectedEntity
        } else {
          this.showPolygon = false
        }
        // 4-1选中线时触发
        if (Cesium.defined(pickedEntity) && window.selectedEntity._polyline !== undefined) {
          let status = cesiumPlot.drawPolylineStatus()
          if (status === 0) {
            that.showPolyline = true
            // that.polylinePosition = window.selectedEntity
          }
        } else {
          this.showPolyline = false
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); //LEFT_DOUBLE_CLICK

      // 必须有这个，拖动地图弹窗位置才会跟着移动
      window.viewer.screenSpaceEventHandler.setInputAction(movement => {
        if (that.popupVisible && window.selectedEntity) {
          that.updatePopupPosition(); // 更新弹窗的位置
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    // 更新弹窗的位置
    updatePopupPosition() {
      // 笛卡尔3转笛卡尔2（屏幕坐标）
      const canvasPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(window.viewer.scene, this.selectedEntityHighDiy)
      if (canvasPosition) {
        this.popupPosition = {
          x: canvasPosition.x,//+ 20,
          y: canvasPosition.y //- 60 // 假设弹窗应该在图标上方 50px 的位置
        };
      }
    },


//截图
//     takeScreenshot() {
//       html2canvas(this.$refs.box).then((canvas) => {
//         // 创建一个临时链接元素
//         const link = document.createElement('a');
//         link.download = 'screenshot.png';
//         link.href = canvas.toDataURL('image/png');
//         // 将链接添加到 DOM 并单击它以下载图像
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         // console.log(this.$el.textContent); // I'm text inside the component.
//       });
//     },


    //-地震列表-------------------------------------
    tableHeaderColor() {
      return {
        'border-color': '#293038',
        'background-color': '#293038 !important', // 此处是elemnetPlus的奇怪bug，header-cell-style中背景颜色不加!important不生效
        'color': '#fff',
        'padding': '0',
        'text-align': 'center',
      }
    },
    // 修改table header的背景色
    tableColor({row, column, rowIndex, columnIndex}) {
      if (rowIndex % 2 == 1) {
        return {
          'border-color': '#313a44',
          'background-color': '#313a44',
          'color': '#fff',
          'padding': '0',
          'text-align': 'center'
        }
      } else {
        return {
          'border-color': '#304156',
          'background-color': '#304156',
          'color': '#fff',
          'padding': '0',
          'text-align': 'center'
        }
      }
    },
    //数组切片
    getPageArr() {
      let arr = []
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      if (end > this.total) {
        end = this.total
      }
      for (; start < end; start++) {
        arr.push(this.getEqData[start])
      }
      return arr
    },
    //`每页 ${val} 条`
    handleSizeChange(val) {
      this.pageSize = val
      this.tableData = this.getPageArr()
      // console.log(`每页 ${val} 条`);
    },
    // `当前页: ${val}`
    handleCurrentChange(val) {
      this.currentPage = val
      this.tableData = this.getPageArr()
      // console.log(`当前页: ${val}`);
    },

    //-地震列表 end-------------------------------------

    // //--------------点------------------------
    //
    //
    // // 重置标绘信息填写的绑定数据
    // resetAddMarkCollection() {
    //   let cesiumStore = useCesiumStore()
    //   new Promise((resolve, reject) => {
    //     // 1-1 先清空store中的数据，这时触发监听，因为是异步，所以用promise写成同步进行
    //     cesiumStore.clearData()
    //     resolve()
    //   }).then(res => {
    //     // 2-1 更改添加点标绘按钮状态使其可以点击
    //     this.openAddStatus = !this.openAddStatus
    //     // 3-1 关闭弹窗
    //     this.addMarkDialogFormVisible = !this.addMarkDialogFormVisible
    //   })
    // },
    //
    // //------------线------------
    //
    // drawPolyline(info) {
    //   cesiumPlot.drawActivatePolyline(info.name, info.img, this.eqid)
    // },
    // // 画线
    // drawN() {
    //   cesiumPlot.drawActivatePolyline("量算")
    // },
    // // 删除线
    // deletePolyline() {
    //   let polyline = window.selectedEntity
    //   cesiumPlot.deletePolyline(polyline)
    //   this.showPolyline = false
    // },
    //
    // //------------面-------------
    //
    // drawPolygon(info) {
    //   console.log(info, "面")
    // },
    // // 画面
    // drawP() {
    //   cesiumPlot.drawActivatePolygon()
    // },
    // // 删除面
    // deletePolygon() {
    //   let polygon = window.selectedEntity//this.polygonPosition
    //   cesiumPlot.deletePolygon(polygon)
    //   this.showPolygon = false
    // },
    //
    // //------------------------------------------------------------------------------

    // cesium自身接口scene.terrainProviderChanged(只读),当地形发生变化时(添加高程)触发
    // 不能用watch来监视scene.terrainProviderChanged,会造成堆栈溢出（内存溢出）
    isTerrainLoaded() {
      let terrainProvider = window.viewer.terrainProvider;
      if (terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
        // console.log("地形未加载")
        return false;
      } else if (Cesium.defined(terrainProvider)) {
        // 如果terrainProvider已定义，但不是EllipsoidTerrainProvider，
        // 则表示已经设置了其他地形提供者
        // console.log("地形已加载")
        return true;
      }
      // console.log("地形未加载")
      return false;
    },
    watchTerrainProviderChanged() {
      let that = this
      window.viewer.scene.terrainProviderChanged.addEventListener(terrainProvider => {
        this.popupVisible = false // 地形改变时关闭弹窗
        let tzs = []
        if (that.modelName === 1) {
          tzs[0] = 9
          tzs[1] = -567
        } else {
          tzs[0] = 15
          tzs[1] = -557
        }
        if (that.isTerrainLoaded()) {
          // that.changeHeight(tzs[0])
          // that.tz = tzs[0]
          // that.find()
        } else {
          // that.changeHeight(tzs[1])
          // that.tz = tzs[1]
          // that.find()
        }
      });
    },
  }
}
</script>

<style>
.eqtitle {
  background-color: #0d325f;
  width: 100%;
  height: 10%;
}

.eqtitle-text_eqname {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-left: 30px;
  margin-right: 60%;
}

.eqTable {
  width: 500px;
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  top: 30px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

#box {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#cesiumContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}


.bottom {
  height: 6%;
  width: 60%;
  left: 12%;
  bottom: 14%;
  position: absolute;
  z-index: 99;
}
.time-ruler {
  position: relative;
  width: 90%;
  height: 100%;
  //background-color: #0d325f;
  //height: 30px;
  left: 8%;

}

.time-ruler-line {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  height: 20%;
  //height: 10px;
  background-color: #ccc;
  transform: translateY(-50%);
}

.time-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #196cd2;
  transition: none;
}

.time-slider {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.play {
  width: 3%;
  hight: 3%;
  position: absolute;
  //top:50%;
  left: 2%;
}

.play-icon,
.pause-icon {
  width: 100%;
  height: 100%;
}

.current-time-info {
  position: absolute;
  bottom: 3%;
  width: 20%;
  left: 8%;
}

.end-time-info {
  position: absolute;
  bottom: 3%;
  width: 20%;
  right: 0%;
}

.timelabel {
  //color: #ffffff;
  color: #000000;
}




.rescue_team{
  position: absolute;
  top: 0%;
  width: 100%;  /* 调整宽度 */
  height: 100%;
  padding: 10px;
  border-radius: 5px;
  left: 0%;
  z-index: 10; /* 提高层级 */
  background-color: rgba(40, 40, 40, 0.4);
}

.news {
  position: absolute;
  top: 6%;
  width: 21%;
  height: 40%;
  padding: 10px;
  border-radius: 5px;
  right: 1%;
  z-index: 20;
  background-color: rgba(40, 40, 40, 0.7);
}

.smallmap {
  position: absolute;
  top: 55%;
  width: 21%;
  height: 40%;
  padding: 10px;
  border-radius: 5px;
  right: 1%;
  z-index: 20;
  background-color: rgba(40, 40, 40, 0.7);
}




.button-container {
  position: absolute;
  z-index: 20;
  bottom: 10%;
  left: 1%;

}


</style>
