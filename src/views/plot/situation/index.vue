<template>
  <div id="cesiumContainer">
    <el-form class="eqTable">
      <el-table :data="tableData" style="width: 100%;margin-bottom: 5px" :stripe="true"
                :header-cell-style="tableHeaderColor" :cell-style="tableColor" @row-click="plotAdj">
        <el-table-column prop="position" label="位置"></el-table-column>
        <el-table-column prop="time" label="发震时间" width="100"></el-table-column>
        <el-table-column prop="magnitude" label="震级" width="50"></el-table-column>
        <el-table-column prop="longitude" label="经度" width="65"></el-table-column>
        <el-table-column prop="latitude" label="纬度" width="65"></el-table-column>
        <el-table-column prop="depth" label="深度" width="50"></el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-form>
    <el-form class="noteContainer">
      <div class="modelAdj">标绘工具</div>
      <el-row>
        <el-col :span="13">
          <el-tree :data="plotTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-col>
        <el-col :span="11">
          <span class="plotTreeItem" v-for="(item,index) in plotTreeClassification" @click="treeItemClick(item)">
            <el-tooltip class="plottreetooltip" effect="dark" :content="item.name" placement="top-start">
              <img :src="item.img" width="30px" height="30px">
            </el-tooltip>
          </span>
          <span class="plotTreeItem" v-if="plotTreeClassification.length===0">
            <el-button type="primary" @click="drawP">量算面积</el-button>
            <el-button type="primary" @click="drawN">量算距离</el-button>
            <el-button style="margin: 10px;" type="danger" @click="deletePolygon"
                       v-if="this.showPolygon">删除面</el-button>
            <el-button style="margin: 10px;" type="danger" @click="deletePolyline"
                       v-if="this.showPolyline">删除线</el-button>
           <el-row>
            <br>
            <el-col :span="24">
              <span style="color: white;">距离：</span>
              <span style="color: white;" id="distanceLine">0</span>
              <span style="color: white;"> 米</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span style="color: white;">面积：</span>
              <span style="color: white;" id="area">0</span>
              <span style="color: white;"> 平方米</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span style="color: white;">区域内标绘个数：</span>
              <span style="color: white;" id="ispointIcon">0 </span>
              <span style="color: white;"> 个</span>
            </el-col>
          </el-row>
          </span>
        </el-col>
      </el-row>
    </el-form>
    <addMarkCollectionDialog
        :addMarkDialogFormVisible="addMarkDialogFormVisible"
        @wsSendPoint="wsSendPoint"
        @drawPoint="drawPoint"
        @clearMarkDialogForm="resetAddMarkCollection"
    />
    <commonPanel
        :visible="popupVisible"
        :position="popupPosition"
        :popupData="popupData"
        @wsSendPoint="wsSendPoint"
        @closePlotPop="closePlotPop"
    />
  </div>

</template>

<script>
import * as Cesium from 'cesium'
import CesiumNavigation from "cesium-navigation-es6";
import {ElMessage} from 'element-plus'
import {initCesium} from '@/cesium/tool/initCesium.js'
import {getPlot, getPlotIcon} from '@/api/system/plot'
import {getAllEq} from '@/api/system/eqlist'
import {initWebSocket} from '@/cesium/WS.js'
import cesiumPlot from '@/cesium/plot/cesiumPlot'
import addMarkCollectionDialog from "@/components/Cesium/addMarkCollectionDialog"
import commonPanel from "@/components/Cesium/CommonPanel";
import {useCesiumStore} from '@/store/modules/cesium.js'

export default {
  components: {
    addMarkCollectionDialog, commonPanel,//CesiumDraw
  },
  data: function () {
    return {
      //-----------标绘部分--------------
      typeList: null,// 点标注控件根据此数据生成
      refenceTypeList: null,//用来对照弹窗中类型的中文
      message: null, // 添加点标绘的时候的弹窗相关
      addMarkDialogFormVisible: false, // 标绘信息填写对话框的显示和隐藏
      showMarkCollection: false, // 点标绘控件的显示和隐藏
      openAddStatus: true, // 用来控制添加billboard按钮的状态，点一次后只有添加完点才能再点击
      //-----------弹窗部分--------------
      selectedEntityHighDiy: null,
      popupPosition: {x: 0, y: 0}, // 弹窗显示位置，传值给子组件
      popupVisible: false, // 弹窗的显示与隐藏，传值给子组件
      popupData: {}, // 弹窗内容，传值给子组件
      //--------------------------------------------------
      showPolygon: false, // y面的删除按钮
      showPolyline: false,// 线的删除按钮
      // ---------------------------------------------------
      plotPicture: [],
      //-------------ws---------------------
      websock: null,
      //-----------------------------------
      plotTreeData: [
        {
          label: '次生灾害类',
          children: [
            {
              label: 'I类（次生地质灾害）',
            },
            {
              label: 'II类（建筑物破坏类）',
            },
            {
              label: 'III类（交通设施破坏类）',
            },
            {
              label: 'IV类（生命线工程破坏类）',
            },
            {
              label: 'V类（水利工程破坏类）',
            },
            {
              label: 'VI类（安全生产事故类）',
            },
          ]
        },
        {
          label: '应急避难类',
          children: [
            {
              label: 'I类（应急避难功能区类）',
            },
            {
              label: 'II类（应急避难设施设备类）',
            },
            {
              label: 'III类（应急避难场所类）',
            },
          ]
        },
        {
          label: '量算工具',
        }
      ],
      defaultProps: {
        label: 'label',
        children: 'children',
      },
      plotTreeClassification: [],
      //----------------------------------
      total: 0,
      pageSize: 6,
      currentPage: 1,
      getEqData: [],
      tableData: [],
      //----------------------------------
      eqid: '',
    };
  },
  mounted() {
    this.init()
    // ---------------------------------------------------
    // 生成实体点击事件的handler
    this.entitiesClickPonpHandler()
    this.watchTerrainProviderChanged()
    // 干四件事获取地震列表、获取最新地震的eqid、设置websocket的eqid、渲染已有的标绘
    this.getEq()
    // 获取标绘图片
    this.getPlotPicture()

  },
  destroyed() {
    this.websock.close()
  },
  methods: {
    // 初始化控件等
    init() {
      let viewer = initCesium(Cesium)
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏版权信息
      window.viewer = viewer
      let options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Cartographic.fromDegrees(103.00, 29.98, 1500, new Cesium.Cartographic)
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
    // 初始化ws
    initWebsocket() {
      this.websock = initWebSocket()
      this.websock.eqid = this.eqid
      // 为什么这样写不生效????
      // this.websock.onmessage = this.wsOnmessage()
      // this.websock.wsAdd = this.wsAdd()
    },
    // 获取本次地震数据库中的数据渲染到地图上
    initPlot(eqid) {
      let that = this
      getPlot({eqid}).then(res=>{
        let data = res
        let pointArr = data.filter(e => e.drawtype === 'point')
        pointArr.forEach(item => {
          let point = {
            eqid:item.eqid,
            plotid:item.plotid,
            time: item.time,
            plottype:item.plottype,
            drawtype:item.drawtype,
            latitude: item.latitude,
            longitude: item.longitude,
            height: item.height,
            img: item.img,
          }
          that.drawPoint(point)
        })
      })
    },
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
          // that.popupData = {
          //   type: window.selectedEntity.properties.type?window.selectedEntity.properties.type.getValue():"",
          //   time: window.selectedEntity.properties.time?window.selectedEntity.properties.time.getValue():"",
          //   name: window.selectedEntity.properties.name?window.selectedEntity.properties.name.getValue():"",
          //   lon: window.selectedEntity.properties.lon?window.selectedEntity.properties.lon.getValue():"",
          //   lat: window.selectedEntity.properties.lat?window.selectedEntity.properties.lat.getValue():"",
          //   describe: window.selectedEntity.properties.describe?window.selectedEntity.properties.describe.getValue():"",
          // };
          this.popupData = window.selectedEntity.properties.data ? window.selectedEntity.properties.data.getValue():""
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
    // 关闭弹窗
    closePlotPop() {
      this.popupVisible = !this.popupVisible
    },
    // 获取标绘图片数据
    getPlotPicture() {
      let that = this
      getPlotIcon().then(res => {
        that.plotPicture = res
        // 设置plotTree初始样式
        // that.plotTreeClassification = res.filter(item=>item.type==="I类（次生地质灾害）")
      })
    },
    //--------------------------------------

    // 切换地震，渲染切换地震的标绘
    plotAdj(row) {
      window.viewer.entities.removeAll();
      this.eqid = row.eqid
      this.websock.eqid = this.eqid
      this.initPlot(row.eqid)
    },
    // 获取地震列表、以及最新地震的eqid、并渲染已有的标绘
    getEq() {
      let that = this
      getAllEq().then(res => {
        that.getEqData = res
        that.total = res.length
        that.tableData = that.getPageArr()
        that.eqid = that.tableData[0].eqid
        // 建立WS
        this.initWebsocket()
        // that.websock.eqid = that.eqid
        this.initPlot(that.eqid)
        // 初始化标绘所需的viewer、ws、pinia
        let cesiumStore = useCesiumStore()
        cesiumPlot.init(window.viewer,this.websock,cesiumStore)
      })
    },
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
    //--------------tree------------------------

    handleNodeClick(data) {
      if (data.label !== "量算工具") {
        this.plotTreeClassification = []
        let arr = this.plotPicture.filter(item => {
          return item.type === data.label
        })
        this.plotTreeClassification = [...arr]
      } else {
        this.plotTreeClassification = []
      }
    },

    treeItemClick(item) {
      if (item.plotType === '点图层') {
        this.openPointPop(item.name, item.img)
      } else if (item.plotType === '线图层') {
        this.drawPolyline(item)
      } else {
        this.drawPolygon(item)
      }
    },

    //--------------点------------------------

    // 打开添加点标绘对话框
    openPointPop(type, img) {
      let that = this
      let cesiumStore = useCesiumStore()
      if (this.openAddStatus) {
        // 1-1 更改添加点标注按钮状态
        this.openAddStatus = !this.openAddStatus
        // 1-2 提示弹窗
        this.message = ElMessage({
          message: '请点击地图添加标注点',
          type: 'info',
          duration: 0
        })
        // 1-3 生成点标注的handler
        cesiumPlot.initPointHandler(type, img, this.eqid).then(res => {
          that.addMarkDialogFormVisible = true
          this.message.close(that.addMarkDialogFormVisible)
        })
      }
    },
    // 画点
    drawPoint(pointInfo) {
      cesiumPlot.drawPoint(pointInfo)
    },
    // 重置标绘信息填写的绑定数据
    resetAddMarkCollection() {
      let cesiumStore = useCesiumStore()
      new Promise((resolve, reject) => {
        // 1-1 先清空store中的数据，这时触发监听，因为是异步，所以用promise写成同步进行
        cesiumStore.clearData()
        resolve()
      }).then(res => {
        // 2-1 更改添加点标绘按钮状态使其可以点击
        this.openAddStatus = !this.openAddStatus
        // 3-1 关闭弹窗
        this.addMarkDialogFormVisible = !this.addMarkDialogFormVisible
      })
    },
    // ws发送数据（只有点的是在这里）
    wsSendPoint(data) {
      this.websock.send(data)
    },

    //------------线------------

    drawPolyline(info) {
      cesiumPlot.drawActivatePolyline(info.name, info.img, this.eqid)
    },
    // 画线
    drawN() {
      cesiumPlot.drawActivatePolyline("量算")
    },
    // 删除线
    deletePolyline() {
      let polyline = window.selectedEntity
      cesiumPlot.deletePolyline(polyline)
      this.showPolyline = false
    },

    //------------面-------------

    drawPolygon(info) {
      console.log(info, "面")
    },
    // 画面
    drawP() {
      cesiumPlot.drawActivatePolygon()
    },
    // 删除面
    deletePolygon() {
      let polygon = window.selectedEntity//this.polygonPosition
      cesiumPlot.deletePolygon(polygon)
      this.showPolygon = false
    },

    //------------------------------------------------------------------------------

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
.cesium-viewer-navigationContainer {
  display: none !important;
}

.el-tree {
  background: rgb(38 36 36) !important;
  color: #ffffff !important;
}

.el-tree-node__content:hover {
  background-color: rgb(38 36 36) !important;
}

.el-tree-node:focus > .el-tree-node__content {
  background-color: rgb(38 36 36) !important;
}

.plotTreeItem {
  margin: 3px;
}

.plottreetooltip {
  margin: 4px;
}

#cesiumContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.markCollection {
  position: absolute;
  padding: 10px;
  top: 630px;
  left: 10px;
  background-color: rgba(40, 40, 40, 0.7);
  z-index: 10; /* 更高的层级 */
}

.markCollection span {
  margin: 5px;
  width: 30px;
  height: 30px;
}

.markCollection span:hover {
  cursor: pointer;
}

.eqTable {
  width: 500px;
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  top: 10px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.noteContainer {
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  top: 390px;
  left: 10px;
  width: 500px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
}

.tool-container {
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  width: 500px;
  top: 90px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.button-container {
  width: 500px;
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  top: 10px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.latlon-legend {
  pointer-events: auto;
  position: absolute;
  border-radius: 15px;
  padding-left: 5px;
  padding-right: 5px;
  bottom: 30px;
  height: 30px;
  width: 125px;
  box-sizing: content-box;
}

.modelAdj {
  color: white;
  margin-bottom: 5px;
}
</style>
