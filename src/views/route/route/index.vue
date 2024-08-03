<template>
  <div id="cesiumContainer">
    <el-form class="tool-container">
      <el-button class="el-button--primary" @click="route">路径规划</el-button>
      <el-button class="el-button--primary" @click="addArea">添加障碍区域</el-button>
      <el-button class="el-button--primary" @click="removeAll">清空所有实体</el-button>
      <el-button class="el-button--primary" @click="removePoint">删除障碍区域</el-button>
      <el-button class="el-button--primary" @click="removePolyline">删除路径规划</el-button>
      <el-button class="el-button--primary" @click="emergencyResourceInformation">应急资源信息</el-button>
    </el-form>
    <RouterPanel :visible="popupVisible" :position="popupPosition" :popupData="popupData" @wsSendPoint="wsSendPoint"/>
    <div id="supplies">
        <el-form class="eqTable">
            <div style="margin-bottom: 10px;">
                <el-input v-model="inputRadius" placeholder="请输入搜查范围/km"
                          style="width: 170px;margin-right: 5px;" clearable>
                </el-input>
                <el-button class="el-button--primary" @click="searchSupply">查找物资</el-button>
                <el-button class="el-button--primary" @click="addDisasterPoint">添加受灾点</el-button>
                <el-button class="el-button--primary" @click="showAllSupplyPoints">显示所有物资点</el-button>
            </div>

            <el-table :data="showSuppliesList" style="width: 100%;margin-bottom: 5px;text-align: center" :stripe="true"
                      :header-cell-style="tableHeaderColor" :cell-style="tableColor"
                      :row-style="{height: '40px'}"
                      @row-click="showSupplyPoint"
            >
                <el-table-column prop="county" label="区域" width="100"></el-table-column>
                <el-table-column prop="address" label="地址" width="200"></el-table-column>
                <el-table-column prop="contactPerson" label="联系人" width="100"></el-table-column>
                <el-table-column prop="contactPhone" label="联系电话"></el-table-column>

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
    </div>
  </div>
</template>

<script>

import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'
import CesiumNavigation from "cesium-navigation-es6";
import {initCesium} from '@/cesium/tool/initCesium.js'
import axios from "axios";
import start from '@/assets/start.svg'
import end from '@/assets/end.svg'
import {Entity} from "cesium";
import RouterPanel from '@/components/Cesium/RouterPanel.vue'
import cesiumPlot from '@/cesium/plot/cesiumPlot.js'
import { initWebSocket } from '@/cesium/WS.js'
import {getDisasterReserves} from "../../../api/system/emergency.js";
import disasterReliefMaterialReserve from '@/assets/images/disasterReliefMaterialReserve.png';


export default {
  components: {
    RouterPanel,
  },
  name: "index",
  data() {
    return {
      viewer: null,
      pos: [],
      areas: [],

      showSuppliesList: [],
      selectedSuppliesList: [],
      showIcon: [],
      total: 0,
      pageSize: 5,
      currentPage: 1,
      addSupplyPointCurrently:{
          lng: 0,
          lat: 0,
          count: 0,
          position: "",
          type: "",
          tel: ""
      },
      inputRadius: "",
      canMarkPoint: false,
      DialogFormVisible: false,
      affectedPoints: [
          { lng: 103.00589, lat: 29.97945, position: 'a'}
      ],
      suppliesList: [],

      //-----------弹窗部分-------------------
      selectedEntityHighDiy: null,
      popupPosition: {x: 0, y: 0}, // 弹窗显示位置，传值给子组件
      popupVisible: false, // 弹窗的显示与隐藏，传值给子组件
      popupData: {}, // 弹窗内容，传值给子组件
    }
  },
  mounted() {
    this.init();
    this.entitiesClickPonpHandler()
    this.watchTerrainProviderChanged();
    cesiumPlot.init(window.viewer, this.websock, this.$store)
    console.log(" this.$router.currentRoute11111111:", this.$router.currentRoute)
    this.initPlot(this.id)
    this.initWebsocket()
    //---------------------------
  },
  methods: {
    init() {
      console.log(" this.$router.currentRoute:2222222", this.$router.currentRoute)
      let viewer = initCesium(Cesium);
      viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权信息
      window.viewer = viewer;
      this.viewer = viewer
      let options = {};
      options.defaultResetView = Cesium.Cartographic.fromDegrees(103.00, 29.98, 1500, new Cesium.Cartographic);
      options.enableCompass = true;
      options.enableZoomControls = true;
      options.enableDistanceLegend = true;
      options.enableCompassOuterRing = true;
      options.resetTooltip = "重置视图";
      options.zoomInTooltip = "放大";
      options.zoomOutTooltip = "缩小";
      window.navigation = new CesiumNavigation(viewer, options);
      document.getElementsByClassName('cesium-geocoder-input')[0].placeholder = '请输入地名进行搜索';
      document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[0].innerHTML = '影像服务';
      document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[1].innerHTML = '地形服务';


      // this.showAllSupplyPoints()

      this.clickCount += 1;

      const ellipsoid = this.viewer.scene.globe.ellipsoid;
      const canvas = this.viewer.scene.canvas;
      const handler = new Cesium.ScreenSpaceEventHandler(canvas);

      handler.setInputAction((movement) => {
          const cartesian = this.viewer.camera.pickEllipsoid(movement.position, ellipsoid);
          if (cartesian) {
              const cartographic = ellipsoid.cartesianToCartographic(cartesian);
              this.addSupplyPointCurrently.lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
              this.addSupplyPointCurrently.lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);

              if(this.canMarkPoint){
                  this.DialogFormVisible = true
                  this.drawSite(this.addSupplyPointCurrently.lat, this.addSupplyPointCurrently.lng,
                      this.clickCount, Cesium.Color.RED);
                  this.canMarkPoint = false
              }
          }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // this.drawSite(Number(this.affectedPoints[0].lat), Number(this.affectedPoints[0].lng),
      //     this.clickCount, Cesium.Color.RED);
    },
    initPlot(){
      getDisasterReserves().then(res=>{
        let data = res
        this.suppliesList = data
        this.showIcon = data
        this.fetSupplyPoints()
        console.log("data",data)
        let pointArr = data.filter(e => e.longitude !== null)
        // console.log("pointArr",pointArr)
        //画点
        this.drawPoint(pointArr)
      })
    },
    drawPoint(pointArr) {
      pointArr.forEach(element => {
        // 检查是否已存在具有相同ID的实体
        let existingEntity = window.viewer.entities.getById(element.id);
        if (existingEntity) {
          console.warn(`Entity with id ${element.id} already exists. Skipping this entity.`);
          return; // 跳过这个实体
        }

        // 检查经度、纬度和高度是否为有效数值
        let longitude = Number(element.longitude);
        let latitude = Number(element.latitude);

        if (isNaN(longitude) || isNaN(latitude)) {
          console.error(`Invalid coordinates for entity with id ${element.id}:`, { longitude, latitude});
          return; // 跳过无效坐标的实体
        }

        // 检查经度和纬度是否在合理范围内
        if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
          console.error(`Coordinates out of range for entity with id ${element.id}:`, { longitude, latitude });
          return; // 跳过坐标超出范围的实体
        }

        // 如果不存在相同ID的实体，则添加新的实体
        try {
          window.viewer.entities.add({
            id: element.id,
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            billboard: {
              image: disasterReliefMaterialReserve, // 使用导入的图标路径
              width: 50,
              height: 50,
              eyeOffset: new Cesium.Cartesian3(0, 0, 0), // 与坐标位置的偏移距离
              color: Cesium.Color.WHITE.withAlpha(1), // 颜色
              scale: 0.8, // 缩放比例
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 绑定到地形高度,让billboard贴地
              depthTest: false, // 禁止深度测试
              disableDepthTestDistance: Number.POSITIVE_INFINITY // 不再进行深度测试
            },
            properties: {
              county: element.county,
              storagePointsCount: element.storagePointsCount,
              totalKitsCount: element.totalKitsCount,
              disasterTentsCount: element.disasterTentsCount,
              cottonBlanketsCount: element.cottonBlanketsCount,
              otherBlanketsCount: element.otherBlanketsCount,
              cottonClothesCount: element.cottonClothesCount,
              cottonCoatsCount: element.cottonCoatsCount,
              otherClothesCount: element.otherClothesCount,
              woolBlanketsCount: element.woolBlanketsCount,
              foldingBedsCount: element.foldingBedsCount,
              bunkBedsCount: element.bunkBedsCount,
              stripedClothBundlesCount: element.stripedClothBundlesCount,
              moistureMatsCount: element.moistureMatsCount,
              generatorsCount: element.otherBlanketsCount,
              lightingFixturesCount: element.lightingFixturesCount,
              lightingKitsCount: element.lightingKitsCount,
              flashlightsCount: element.flashlightsCount,
              raincoatsCount: element.raincoatsCount,
              rainBootsCount: element.rainBootsCount,
              otherSuppliesCount: element.otherSuppliesCount,
              address: element.address,
              lon: element.longitude,
              lat: element.latitude,
              contactPerson: element.contactPerson,
              contactPhone: element.contactPhone,
              insertTime: element.insertTime,
              id: element.id
            }
          });
        } catch (error) {
          console.error(`Error adding entity with id ${element.id}:`, error);
        }
      });
    },
    initWebsocket() {
      this.websock = initWebSocket()
      this.websock.id = this.id
    },
    // ws发送数据（只有点的是在这里）
    wsSendPoint(data) {
      this.websock.send(data)
    },
    /** 计算两个坐标的距离，单位米 **/
    Distance(lng1, lat1, lng2, lat2) {
      //采用Haversine formula算法，高德地图的js计算代码，比较简洁 https://www.cnblogs.com/ggz19/p/7551088.html
      let d=Math.PI/180;
      let f=lat1*d, h=lat2*d;
      let i=lng2*d - lng1*d;
      let e=(1 - Math.cos(h - f) + (1 - Math.cos(i)) * Math.cos(f) * Math.cos(h)) / 2;
      return 2 * 6378137 * Math.asin(Math.sqrt(e));
    },
    /** 以坐标点为中心，简单粗略的创建一个指定半径的圆，半径单位米，pointCount为构建圆的坐标点数（比如24个点，点越多越圆，最少3个点），返回构成圆的坐标点数组 **/
    CreateSimpleCircle(lng, lat, radius, pointCount){
      //球面坐标不会算，转换成三角坐标简单点，经度代表值大约：0.01≈1km 0.1≈10km 1≈100km 10≈1000km
      let km=radius/1000;
      let a=km<5?0.01 :km<50?0.1 :km<500?1 :10;
      let b=this.Distance(lng, lat, lng+a, lat);
      let c=this.Distance(lng, lat, lng, lat+a);
      let rb=radius/b*a;
      let rc=radius/c*a;
      let arr=[];
      let n=0,step=360.0/pointCount,N=360-step/2; //注意浮点数±0.000000001的差异
      for(let i=0;n<N;i++,n+=step){
        let x=lng+rb*Math.cos(n*Math.PI/180);
        let y=lat+rc*Math.sin(n*Math.PI/180);
        arr[i]=[x, y];
      }
      arr.push([arr[0][0], arr[0][1]]); //闭环
      return arr;
    },
    route(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      let that =this
      let propertiesId = []
      handler.setInputAction((event) => {

        // 1-1 获取点击的位置的坐标信息（经度、纬度、高度）
        let ray = viewer.camera.getPickRay(event.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // // 1-2 坐标系转换
        let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
        let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
        let lat = Cesium.Math.toDegrees((cartographic.latitude))
        that.pos.push([lon,lat])
        let billBoardId = Date.now()
        if(that.pos.length===1){
          that.billboardD(position,start,billBoardId)
          propertiesId.push(billBoardId)
        }else {
          that.billboardD(position,end,billBoardId)
          propertiesId.push(billBoardId)
        }
        if(that.pos.length===2){
          axios.post('http://192.168.0.107:8089/map_test/way', { // 'http://127.0.0.1:8089/map_test/way'
            pathWay:that.pos,
            hardAreas:that.areas
          }).then(function (response) {
            console.log(response.data,123)
            that.polylineD(response.data.path,propertiesId)
            that.pos = []
          }).catch(err=>{
            alert("无可行路径")
          })
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    polylineD(data,propertiesId){
      let arr = []
      for(let i=0;i<data.length;i++){
        let c3 = Cesium.Cartesian3.fromDegrees(data[i][0],data[i][1])
        // let cartographic = Cesium.Cartographic.fromDegrees(data[i][0],data[i][1])
        // let cartesian3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cartographic)
        arr.push(c3)
      }
      viewer.entities.add({
        polyline: {
          positions: arr,
          width: 10,
          depthFailMaterial: Cesium.Color.YELLOW,
          clampToGround: true,
        },
        properties: {
          propertiesId
        }
      })
    },
    polygonD(positions,id){
      let arr = []
      for(let i=0;i<positions.length;i++){
        let a = Cesium.Cartesian3.fromDegrees(positions[i][0],positions[i][1])
        arr.push(a)
      }
      let polygon = new Entity({
        id:id  ,
        polygon: {
          hierarchy: arr,
          material: new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
          clampToGround: true,
        },
        properties: {
        }
      })
      viewer.entities.add(polygon)
    },
    pointD(position,id){
      return viewer.entities.add({
        id:id,
        position: position,
        point: {
          pixelSize: 20,
          color: Cesium.Color.RED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
      })
    },
    billboardD(position,img,billBoardId){
      viewer.entities.add({
        id:billBoardId,
        position: position,
        billboard: {
          image: disasterReliefMaterialReserve,
          width: 25,//图片宽度,单位px
          height: 25,//图片高度，单位px
          // eyeOffset: new Cesium.Cartesian3(-1, 1, 0),//与坐标位置的偏移距离
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
          depthTest: false,//禁止深度测试但是没有下面那句有用
          disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
        },
      })
    },
    addArea(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      let that = this
      handler.setInputAction((event) => {
        // 1-1 获取点击的位置的坐标信息（经度、纬度、高度）
        let ray = viewer.camera.getPickRay(event.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // // 1-2 坐标系转换
        let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
        let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
        let lat = Cesium.Math.toDegrees((cartographic.latitude))
        let ar = that.CreateSimpleCircle(lon,lat,50,24)
        that.areas.push({"area":ar,"name":'area_'+Date.now()})
        let id = 'area_'+Date.now()
        that.pointD(position,id)
        that.polygonD(ar,id+'a')
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    removeAll(){
      viewer.entities.removeAll();
      this.areas = []
    },
    removePoint(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      let that = this
      handler.setInputAction(async (click) => {
        let pickedEntity = window.viewer.scene.pick(click.position);
        // let entity = window.selectedEntity = pickedEntity?.id
        let entity = pickedEntity?.id
        if (Cesium.defined(pickedEntity) && entity._point !== undefined) {
          let id = entity.id
          that.areas = that.areas.filter(area=>area.name !== id)
          viewer.entities.remove(entity)
          viewer.entities.removeById(id+'a')
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    removePolyline(){
      let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
      handler.setInputAction(async (click) => {
        let pickedEntity = window.viewer.scene.pick(click.position);
        let entity = window.selectedEntity = pickedEntity?.id
        if (Cesium.defined(pickedEntity) && window.selectedEntity._polyline !== undefined) {
          let propertiesId = entity.properties.propertiesId._value
          for(let i=0;i<propertiesId.length;i++){
            console.log(propertiesId[i],propertiesId[i]+"")
            viewer.entities.removeById(propertiesId[i]+"")
          }
          viewer.entities.remove(entity)
          handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    emergencyResourceInformation(){
      // 调用 initPlot 方法
      this.initPlot();
    },
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
        if(that.modelName === 1){
          tzs[0] = 9
          tzs[1] = -567
        }else {
          tzs[0] = 15
          tzs[1] = -557
        }
        if(that.isTerrainLoaded()){
          that.changeHeight(tzs[0])
          that.tz = tzs[0]
          that.find()
        }else {
          that.changeHeight(tzs[1])
          that.tz = tzs[1]
          that.find()
        }
      });
    },

    entitiesClickPonpHandler() {
      let that = this
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
          that.popupData = {
            county: window.selectedEntity.properties.county.getValue(),
            storagePointsCount: window.selectedEntity.properties.storagePointsCount.getValue(),
            totalKitsCount: window.selectedEntity.properties.totalKitsCount.getValue(),
            disasterTentsCount: window.selectedEntity.properties.disasterTentsCount.getValue(),
            cottonBlanketsCount: window.selectedEntity.properties.cottonBlanketsCount.getValue(),
            otherBlanketsCount: window.selectedEntity.properties.otherBlanketsCount.getValue(),
            cottonClothesCount: window.selectedEntity.properties.cottonClothesCount.getValue(),
            cottonCoatsCount: window.selectedEntity.properties.cottonCoatsCount.getValue(),
            otherClothesCount: window.selectedEntity.properties.otherClothesCount.getValue(),
            woolBlanketsCount: window.selectedEntity.properties.woolBlanketsCount.getValue(),
            foldingBedsCount: window.selectedEntity.properties.foldingBedsCount.getValue(),
            bunkBedsCount: window.selectedEntity.properties.bunkBedsCount.getValue(),
            stripedClothBundlesCount: window.selectedEntity.properties.stripedClothBundlesCount.getValue(),
            moistureMatsCount: window.selectedEntity.properties.moistureMatsCount.getValue(),
            generatorsCount: window.selectedEntity.properties.generatorsCount.getValue(),
            lightingFixturesCount: window.selectedEntity.properties.lightingFixturesCount.getValue(),
            lightingKitsCount: window.selectedEntity.properties.lightingKitsCount.getValue(),
            flashlightsCount: window.selectedEntity.properties.flashlightsCount.getValue(),
            raincoatsCount: window.selectedEntity.properties.raincoatsCount.getValue(),
            rainBootsCount: window.selectedEntity.properties.rainBootsCount.getValue(),
            otherSuppliesCount: window.selectedEntity.properties.otherSuppliesCount.getValue(),
            address: window.selectedEntity.properties.address.getValue(),
            lon: window.selectedEntity.properties.lon.getValue(),
            lat: window.selectedEntity.properties.lat.getValue(),
            contactPerson: window.selectedEntity.properties.contactPerson.getValue(),
            contactPhone: window.selectedEntity.properties.contactPhone.getValue(),
            insertTime: window.selectedEntity.properties.insertTime.getValue(),
            id: window.selectedEntity.properties.id.getValue(),
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

    //--------------------弹窗----------------------
    // 判断是否有高程
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
     // 绘制点
     drawSite(lat, lng, id, color) {
         const point = {
             id: id,
             position: Cesium.Cartesian3.fromDegrees(parseFloat(lng), parseFloat(lat)),
         };
         this.affectedPoints.push(point);

         if (this.viewer) {
             this.viewer.entities.add({
                 position: point.position,
                 point: {
                     pixelSize: 10,
                     color: color,
                 },
             });
         }
     },

     fetSupplyPoints(){
         this.selectedSuppliesList = this.suppliesList
         this.total = this.selectedSuppliesList.length
         this.showSuppliesList = this.getPageArr(this.selectedSuppliesList)
         // console.log("this.showSuppliesList-",this.showSuppliesList)
     },

      showSupplyPoint(row){
          // console.log("点击了：",row)
          this.showIcon = []
          this.showIcon.push(row)
          this.removePoints(this.suppliesList)
          this.drawPoint(this.showIcon)
      },

      removePoints(entityArr) {
          entityArr.forEach(entity => {
              let id = entity.id;
              let existingEntity = window.viewer.entities.getById(id);
              if (existingEntity) {
                  window.viewer.entities.removeById(id);
              } else {
              }
          });
      },

      showAllSupplyPoints(){
        this.viewer.entities.values.forEach(entity => {
            if (entity.ellipse) {
                this.viewer.entities.remove(entity);
            }
        });
        this.removePoints(this.showIcon)
        this.drawPoint(this.suppliesList)
      },

      searchSupply(){
          if(!isNaN(parseFloat(this.inputRadius))){
              let longitude = parseFloat(this.addSupplyPointCurrently.lng);
              let latitude = parseFloat(this.addSupplyPointCurrently.lat);
              const clickPoint = Cesium.Cartesian3.fromDegrees(longitude, latitude);
              this.selectedSuppliesList = [];
              this.suppliesList.forEach((point, index) => {
                  const pointLongitude = parseFloat(point.longitude);
                  const pointLatitude = parseFloat(point.latitude);
                  const initialPoint = Cesium.Cartesian3.fromDegrees(pointLongitude, pointLatitude);
                  const distance = Cesium.Cartesian3.distance(clickPoint, initialPoint) / 1000; // 距离以公里为单位
                  if (distance < this.inputRadius) {
                      this.selectedSuppliesList.push(point);
                  }
              });
              this.total = this.selectedSuppliesList.length
              this.showSuppliesList = this.getPageArr(this.selectedSuppliesList)
              this.removePoints(this.showIcon)
              this.showIcon = this.selectedSuppliesList
              this.drawPoint(this.showIcon)
              this.selectPoints()
          }
      },
      // 查询指定范围内的物资点
      selectPoints() {
          if (!isNaN(parseFloat(this.inputRadius))) {
              // 确保 inputRadius 为数字类型  画圆的单位为m
              const radius = parseFloat(this.inputRadius) * 1000;
              // 将经纬度转换为 Cartesian3 类型
              const position = Cesium.Cartesian3.fromDegrees(
                  parseFloat(this.addSupplyPointCurrently.lng),
                  parseFloat(this.addSupplyPointCurrently.lat)
              );
              this.viewer.entities.values.forEach(entity => {
                  if (entity.ellipse) {
                      this.viewer.entities.remove(entity);
                  }
              });
              this.viewer.entities.add({
                  position: position,
                  ellipse: {
                      semiMajorAxis: radius,
                      semiMinorAxis: radius,
                      material: Cesium.Color.GREEN.withAlpha(0.5),
                  },
              });
          }
      },
      // 添加物资点
      addDisasterPoint(){
          this.canMarkPoint = true
      },
      getPageArr(arr){
          let newArr = []
          let start = (this.currentPage - 1) * this.pageSize
          let end = this.currentPage * this.pageSize
          if (end > this.total) {
              end = this.total
          }
          for (; start < end; start++) {
              newArr.push(arr[start])
          }
          return newArr
      },
      handleSizeChange(val) {
          this.pageSize = val
          this.showSuppliesList = this.getPageArr(this.selectedSuppliesList)
      },
      handleCurrentChange(val) {
          this.currentPage = val
          this.showSuppliesList = this.getPageArr(this.selectedSuppliesList)
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

  }
}
</script>

<style scoped>
    .cesium-viewer-navigationContainer {
        display: none !important;
    }
    .tool-container {
        position: absolute;
        padding: 15px;
        border-radius: 5px;
        /*width: 500px;*/
        /*height: 200px;*/
        top: 10px;
        left: 10px;
        z-index: 10; /* 更高的层级 */
        background-color: rgba(40, 40, 40, 0.7);
    }
    #cesiumContainer {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
    #supplies{
        position: absolute;
        padding: 15px;
        border-radius: 5px;
        /*width: 500px;*/
        /*height: 200px;*/
        top: 80px;
        left: 10px;
        width: 36rem;
        z-index: 10; /* 更高的层级 */
        background-color: rgba(40, 40, 40, 0.7);
    }

    .eqListfade-enter-active, .eqListfade-leave-active {
        transition: opacity .5s;
    }

    .eqListfade-enter, .eqListfade-leave-to {
        opacity: 0;
    }

    .button-container {
        position: absolute;
        padding: 15px;
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
        margin-bottom: 15px;
    }
</style>
