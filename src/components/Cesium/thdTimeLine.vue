<template>
  <div>
<!--    box包裹地图，截图需要-->
  <div id="box" ref="box">
    <div id="cesiumContainer">
<!--      <div class="legend">-->
<!--        <img src="../../assets/images/TimeLine/legend.png" style="width: 23%;height: 23%">-->
<!--      </div>-->
      <!--          面板信息-->
     <commonPanelTimeLine
         :visible="popupVisible"
         :position="popupPosition"
        :popupData="popupData"
    />
    </div>
  </div>
<!-- 进度条-->
    <div class="bottom" >
      <div class="play">
<!--        <img src="../../assets/images/TimeLine/legend.png" style="width: 23%;height: 23%">-->
<!--        <img class="play-pause-icon" src="../../assets/images/TimeLine/pause.png" style="width: 23%;height: 23%">-->

      </div>
      <div class="time-ruler">
        <div class="time-ruler-line">
          <div class="time-progress" :style="{ width: `${currentTimePosition}%` }"></div>
        </div>
      </div>

<!--      时间点-->
      <div class="current-time-info">
        <span class="timelabel">{{ this.formatTime(this.currentTime) }}</span>
      </div>
      <div class="end-time-info">
        <div class="timelabel">{{this.formatTime(this.eqendTime)}}</div>
      </div>

    </div>

<!--报告产出按钮-->
    <div class="button-container">
      <el-button class="el-button--primary" size="small" @click="takeScreenshot">报告产出</el-button>
    </div>

  </div>
</template>


<script>
import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'
import {initCesium} from '@/cesium/tool/initCesium.js'
import CesiumNavigation from "cesium-navigation-es6";
import {getEqbyId} from '@/api/system/eqlist'
import {getPlotwithStartandEndTime} from '@/api/system/plot'
import geojsonmap from '@/assets/geoJson/map.json'

//报告产出
import jsPDF from "jspdf";
import "@/assets/json/TimeLine/SimHei-normal.js";
import html2canvas from "html2canvas";
// import canvas2image from 'canvas2image';
// import commonPanelOnlyShow from "@/components/Cesium/CommonPanelOnlyShow.vue";
import commonPanelTimeLine from "@/components/Cesium/CommonPanelTimeLine.vue";

export default {
  components: {
    commonPanelTimeLine
  },

  data: function () {
    return {
      //-----------弹窗部分--------------
      selectedEntityHighDiy: null,
      popupPosition: {x: 0, y: 0}, // 弹窗显示位置，传值给子组件
      popupVisible: false, // 弹窗的显示与隐藏，传值给子组件
      popupData: {}, // 弹窗内容，传值给子组件
      // --------------------------------------------------
      showPolygon: false, // y面的删除按钮
      showPolyline: false,// 线的删除按钮
      //-----------弹窗部分 end--------------
      viewer:'',
      store:'',

      currentTimePosition: 0,
      currentNodeIndex:1,
      intervalId: null,
      eqid:'',

      //时间轴时间
      eqstartTime:'',
      currentTime: '',
      eqendTime:'',


      centerPoint:null,
      //用于记录是否是第一次加载点，false表示还没有加载
      plotisshow:{},
      plots:[],
    };
  },

  created() {
    this.eqid = this.$route.params.eqid
  },

  mounted() {
    this.viewer = window.viewer
    this.store = this.$store
    this.getEqInfo(this.eqid)
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    //格式化时间
    formatTime(date) {
      // console.log(date)
      var dateString = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      // 将字符串转换为 'yyyy-MM-dd HH:mm:ss' 格式
      dateString = dateString.replace(/年|月/g, '-').replace(/日|时|分|秒/g, ' ');
      return dateString
    },
    //取地震信息+开始结束当前时间初始化
    getEqInfo(eqid){
      // this.getPlot(eqid)
      getEqbyId({eqid:eqid}).then(res => {
        // console.log(res)
        this.centerPoint=res
        this.centerPoint.id="center"
        this.eqstartTime=new Date(res.time)
        // 计算结束时间 结束时间为开始后72小时，单位为毫秒
        this.eqendTime = new Date(this.eqstartTime.getTime() + (72 * 60 * 60 * 1000));
        this.currentTime=this.eqstartTime
        this.getPlotwithStartandEndTime(this.eqid)
      })
    },

    getPlotwithStartandEndTime(eqid){
      // console.log("function getAllPlotInfo")
      getPlotwithStartandEndTime({eqid: eqid}).then(res => {
        this.plots = res
        console.log(res)
            res.forEach(item => {
              this.plotisshow[item.plotid]=0
            })
        // this.getPlot(this.eqid)
        // console.log(this.plotisshow)
        this.init(this.eqid)
      })
    },

    init(eqid) {
      const viewer = initCesium(Cesium)
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
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
      window.viewer = viewer
      // console.log("window.viewer init",window.viewer)
      let options = {}
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

      viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(
          geojsonmap,
          {
            stroke: Cesium.Color.RED,   // 边框颜色
            // fill: Cesium.Color.RED.withAlpha(0.5),  // 填充颜色
            strokeWidth: 3, // 边框宽度
          })
      );

    // 生成实体点击事件的handler
      this.entitiesClickPonpHandler()
      this.watchTerrainProviderChanged()
      //开启时间轴
      this.startTimerLine();
    },

    //时间轴变换
    startTimerLine() {
      //归零
      viewer.entities.removeAll();
      this.currentNodeIndex=0;
      this.currentTime=this.eqstartTime;
      this.currentTimePosition=0;

      //时间轴开始
      this.intervalId = setInterval(() => {
        this.updateCurrentTime();
      }, 160);
    },

    stopTimer() {
      clearInterval(this.intervalId);
    },
    updateCurrentTime() {
      //当前往前一步等于真实世界20分钟;6步等于1s; (1s等于2小时)
      this.currentNodeIndex=(this.currentNodeIndex+1)%216
      let tmp=100.0/216.0
      // // 当前往前一步等于真实世界10分钟 600s ;6步等于1s; (1s等于1小时)=60分钟
      // this.currentNodeIndex=(this.currentNodeIndex+1)%432
      // let tmp=100.0/432.0
      // // 当前往前一步等于真实世界5分钟 300s ;6步等于1s; (1s等于0.5小时)=30分钟
      // this.currentNodeIndex=(this.currentNodeIndex+1)%864
      // let tmp=100.0/864.0
      this.currentTimePosition +=tmp;

      if (this.currentTimePosition >= 100) {
        this.currentTimePosition = 100;
        this.currentTime=this.eqendTime
        this.stopTimer();
      }
      else{
        this.currentTimePosition=this.currentTimePosition%100
        // 当前往前一步等于真实世界20分钟(1s等于2小时)
        this.currentTime = new Date(this.eqstartTime.getTime()+ this.currentNodeIndex * 20 * 60* 1000);
        // 当前往前一步等于真实世界10分钟(1s等于1小时)
        // this.currentTime = new Date(this.startTime.getTime()+ this.currentNodeIndex * 10 * 60 * 1000);
        // 当前往前一步等于真实世界5分钟 300s ;6步等于1s; (1s等于0.5小时)=30分钟
        // this.currentTime = new Date(this.startTime.getTime()+ this.currentNodeIndex * 5 * 60 * 1000);
      //   // this.updatePlot(this.currentNodeIndex)
        this.updatePlot()
      }
    },

    updatePlot() {
      //添加
      let pointArr =  this.plots.filter(e => e.drawtype === 'point')

        pointArr.forEach(item => {
          const currentDate = new Date(this.currentTime);
          // 将 this.timestampToTime(item.starttime) 转换为 Date 对象
          const startDate = new Date(this.timestampToTime(parseInt(item.starttime)));
          const endDate = new Date(this.timestampToTime(parseInt(item.endtime)));
          // console.log(endDate,currentDate)
          if((startDate<=currentDate) && (this.plotisshow[item.plotid]==0)){
              this.plotisshow[item.plotid]=1
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
                  width: 50,
                  height: 50,
                },
                // label: {
                //   // text: item.pointname,
                //   show: true,
                //   font: '14px sans-serif',
                //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                //   outlineWidth: 2,
                //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                //   pixelOffset: new Cesium.Cartesian2(0, -16),
                // },
                plotid: item.plotid,
                plottype:item.plottype,
              });
            }
          if(endDate<=currentDate && this.plotisshow[item.plotid]==1){
            this.plotisshow[item.plotid]=2
            // console.log(item.plotid,"end")
            viewer.entities.removeById(item.plotid)
          }
        });
    },
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
    //---------------------信息面板----------------------------
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
    // cesium自身接口scene.terrainProviderChanged(只读),当地形发生变化时(添加高程)触发
    // 不能用watch来监视scene.terrainProviderChanged,会造成堆栈溢出（内存溢出）
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
          that.changeHeight(tzs[0])
          that.tz = tzs[0]
          that.find()
        } else {
          that.changeHeight(tzs[1])
          that.tz = tzs[1]
          that.find()
        }
      });
    },
    // // 所有entity实体类型点击事件的handler（billboard、polyline、polygon）
    entitiesClickPonpHandler(item) {
      // console.log(item)
      // console.log(item)
      let that = this
      // console.log("window.viewer entitiy",window.viewer)
      window.viewer.screenSpaceEventHandler.setInputAction(async (click) => {

        // 1-1 获取点击点的信息（包括）
        let pickedEntity = window.viewer.scene.pick(click.position);
        window.selectedEntity = pickedEntity?.id
        // 2-1 判断点击物体是否为点实体（billboard）
        if (Cesium.defined(pickedEntity) && window.selectedEntity !== undefined && window.selectedEntity._billboard !== undefined) {
          // const cesiumPosition = that.selectedEntity.position.getValue(
          //     window.viewer.clock.currentTime
          // );
          //
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
          // console.log("window.selectedEntity",window.selectedEntity)
          that.popupData = {
            plotid:window.selectedEntity.plotid,
            plotname:window.selectedEntity.plottype,
          };
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
    //----------------------信息面板end------------------------
    //截图
    takeScreenshot() {
      html2canvas(this.$refs.box).then((canvas) => {
        // 创建一个临时链接元素
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL('image/png');
        // 将链接添加到 DOM 并单击它以下载图像
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // console.log(this.$el.textContent); // I'm text inside the component.
      });
    },
  }
}
</script>

<style>
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


.legend {
  z-index:99;
  position:absolute;
  bottom: 3%;
  //right:-41%;
  right:-33%;
  flex-direction: row;
}

.button-container {
  z-index:99;
  position:absolute;
  top:50%;
  left:0%;
  width:6%;
}

.bottom {
  height: 6%;
  width: 100%;
  left: 0%;
  bottom: 0%;
  position:absolute;
  /*防止组件图层被覆盖无法点击*/
  z-index: 99;
}
.time-ruler {
  position: relative;
  width: 90%;
  height: 30px;
  left: 8%;
}

.time-ruler-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: #ccc;
  transform: translateY(-50%);
}
.time-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #3498db;
  transition: width 0.3s ease-in-out;
}
.current-time-info{
  position: absolute;
  bottom:3%;
  width:10%;
  left:8%;
}
.end-time-info{
  position: absolute;
  bottom:3%;
  width:10%;
  right:0%;
}
.timelabel{
  color: #FFFFFF;
}
.time-ruler-node {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color:#00afff;
}

.time-ruler-node-label {
  font-size: 20px;
  color: #ff0059;
}

.current-time {
  position: absolute;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(-50%);
}

.current-time-label {
  font-size: 20px;
  color: #e10707;
}

.current-time-indicator {
  width: 10px;
  height: 10px;
  background-color: #2eeeff;
  border-radius: 50%;
}
</style>
