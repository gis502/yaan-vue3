<template>
  <div id="cesiumContainer">
<!--    <el-form class="tool-container">-->
<!--    写功能按钮部分-->
<!--    </el-form>-->
    <RouterPanel :visible="popupVisible" :position="popupPosition" :popupData="popupData" />
  </div>
</template>

<script>

import * as Cesium from 'cesium'
import 'cesium/Source/Widgets/widgets.css'
import CesiumNavigation from "cesium-navigation-es6";
import {initCesium} from '@/cesium/tool/initCesium.js'
import RouterPanel from '@/components/Cesium/RouterPanel.vue'
import cesiumPlot from '@/cesium/plot/cesiumPlot.js'
import {getEmergency} from "@/api/system/emergency.js";
import disasterReservesLogo from '@/assets/images/disasterReservesLogo.jpg';
import disasterSuppliesLogo from '@/assets/images/disasterSuppliesLogo.png';


export default {
  components: {
    RouterPanel,
  },
  name: "index",
  data() {
    return {
      pos: [],
      areas: [],
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
    this.initPlot(this.id)
  },
  methods: {
    init() {
      let viewer = initCesium(Cesium);
      viewer._cesiumWidget._creditContainer.style.display = 'none'; // 隐藏版权信息
      window.viewer = viewer;
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
    },
    initPlot() {
      getEmergency().then(res => {
        let disasterReserves = res.disasterReserves; // 提取 disasterReserves 列表
        let disasterSupplies = res.disasterSupplies; // 提取 disasterSupplies 列表
        console.log('获取到的res', res);

        console.log("救灾物资储备", disasterReserves);
        console.log("抢险救援装备", disasterSupplies);

        // 对 disasterReserves 进行处理
        if (Array.isArray(disasterReserves)) {
          let pointArr = disasterReserves.filter(e => e.longitude !== null);
          // 画点
          this.drawPointReserves(pointArr);
        } else {
          console.error("灾备物资数据格式不正确", disasterReserves);
        }

        // 对 disasterSupplies 进行处理
        if (Array.isArray(disasterSupplies)) {
          let pointArr = disasterSupplies.filter(e => e.longitude !== null);
          // 画点
          this.drawPointSupplies(pointArr);
        } else {
          console.error("救灾用品数据格式不正确", disasterSupplies);
        }
      });
    },

    drawPointReserves(pointArr) {
      pointArr.forEach(element => {
        // 检查是否已存在具有相同ID的实体
        let existingEntity = window.viewer.entities.getById(element.id);
        if (existingEntity) {
          console.warn(`id为${element.id}的实体已存在。跳过此实体`);
          return; // 跳过这个实体
        }

        // 检查经度、纬度和高度是否为有效数值
        let longitude = Number(element.longitude);
        let latitude = Number(element.latitude);
        if (isNaN(longitude) || isNaN(latitude)) {
          console.error(`id为${element.id}的实体的坐标无效`, { longitude, latitude });
          return; // 跳过无效坐标的实体
        }
        // 检查经度和纬度是否在合理范围内
        if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
          console.error(`id为 ${element.id}的实体坐标超出范围`, { longitude, latitude });
          return; // 跳过坐标超出范围的实体
        }

        // 如果不存在相同ID的实体，则准备新的实体
        window.viewer.entities.add({
          id: element.id,
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          billboard: {
            image: disasterReservesLogo, // 使用导入的图标路径
            width: 40, // 导入图标的宽度
            height: 40, // 导入图标的长度
            eyeOffset: new Cesium.Cartesian3(0, 0, 0), // 与坐标位置的偏移距离
            color: Cesium.Color.WHITE.withAlpha(1), // 颜色
            scale: 0.8, // 缩放比例
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 绑定到地形高度,让billboard贴地
            depthTest: false, // 禁止深度测试
            disableDepthTestDistance: Number.POSITIVE_INFINITY // 不再进行深度测试
          },
          properties: {
            tableName: "救灾物资储备",
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
            generatorsCount: element.generatorsCount, // 纠正：原代码错误地使用了其他BlanketsCount
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
            insertTime: element.insertTime
          }
        });
      });
    },
    drawPointSupplies(pointArr) {
      pointArr.forEach(element => {
        // 检查是否已存在具有相同ID的实体
        let existingEntity = window.viewer.entities.getById(element.id);
        if (existingEntity) {
          console.warn(`id为${element.id}的实体已存在。跳过此实体`);
          return; // 跳过这个实体
        }

        // 检查经度、纬度和高度是否为有效数值
        let longitude = Number(element.longitude);
        let latitude = Number(element.latitude);
        if (isNaN(longitude) || isNaN(latitude)) {
          console.error(`id为${element.id}的实体的坐标无效`, { longitude, latitude });
          return; // 跳过无效坐标的实体
        }
        // 检查经度和纬度是否在合理范围内
        if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
          console.error(`id为 ${element.id}的实体坐标超出范围`, { longitude, latitude });
          return; // 跳过坐标超出范围的实体
        }

        // 如果不存在相同ID的实体，则准备新的实体
        window.viewer.entities.add({
          id: element.id,
          position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
          billboard: {
            image: disasterSuppliesLogo, // 使用导入的图标路径
            width: 40, // 导入图标的宽度
            height: 40, // 导入图标的长度
            eyeOffset: new Cesium.Cartesian3(0, 0, 0), // 与坐标位置的偏移距离
            color: Cesium.Color.WHITE.withAlpha(1), // 颜色
            scale: 0.8, // 缩放比例
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 绑定到地形高度,让billboard贴地
            depthTest: false, // 禁止深度测试
            disableDepthTestDistance: Number.POSITIVE_INFINITY // 不再进行深度测试
          },
          properties: {
            tableName: "抢险救灾装备",
            id: element.id,
            county: element.county,
            totalItems: element.totalItems,
            infraredDetectors: element.infraredDetectors,
            opticalDetectors: element.opticalDetectors,
            hydraulicSpreaders: element.hydraulicSpreaders,
            hydraulicCutters: element.hydraulicCutters,
            rockDrills: element.rockDrills,
            crowbars: element.crowbars,
            rebarCutters: element.rebarCutters,
            hydraulicJacks: element.hydraulicJacks,
            lightSticks: element.lightSticks,
            fuelLiters: element.fuelLiters,
            tensileRopeMeters: element.tensileRopeMeters,
            rescueRopesMeters: element.rescueRopesMeters,
            ropeThrowers: element.ropeThrowers,
            foldingLadders: element.foldingLadders,
            shovelsPicksHooksForksHammers: element.shovelsPicksHooksForksHammers,
            foldingShovels: element.foldingShovels,
            whistles: element.whistles,
            helmets: element.helmets,
            rainBoots: element.rainBoots,
            gloves: element.gloves,
            lifelinesMeters: element.lifelinesMeters,
            drainagePumps: element.drainagePumps,
            fireBlowers: element.fireBlowers,
            ironShovels: element.ironShovels,
            lifeJackets: element.lifeJackets,
            lifeRings: element.lifeRings,
            warningTapesMeters: element.warningTapesMeters,
            walkieTalkies: element.walkieTalkies,
            megaphones: element.megaphones,
            gongs: element.gongs,
            headlamps: element.headlamps,
            portableLights: element.portableLights,
            medicalKits: element.medicalKits,
            excavators: element.excavators,
            loaders: element.loaders,
            waterPumps: element.waterPumps,
            relayPumps: element.relayPumps,
            mobileWaterBags: element.mobileWaterBags,
            backpackFireSprayers: element.backpackFireSprayers,
            chainsaws: element.chainsaws,
            hosesMeters: element.hosesMeters,
            fireTrucks: element.fireTrucks,
            otherSupplies: element.otherSupplies,
            address: element.address,
            lon: element.longitude,
            lat: element.latitude,
            contactPerson: element.contactPerson,
            contactPhone: element.contactPhone
          }
        });
      });
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
      let that = this;
      // 处理点击事件
      window.viewer.screenSpaceEventHandler.setInputAction(async (click) => {
        // 获取点击位置的实体
        let pickedEntity = window.viewer.scene.pick(click.position);
        window.selectedEntity = pickedEntity?.id;

        if (Cesium.defined(pickedEntity)) {
          let entity = window.selectedEntity;

          // 判断实体类型并处理
          if (entity._billboard) {
            // 获取点击点的经纬度
            let ray = viewer.camera.getPickRay(click.position);
            let position = viewer.scene.globe.pick(ray, viewer.scene);
            let cartographic = Cesium.Cartographic.fromCartesian(position);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);

            // 如果有地形加载，更新高度
            let height = 0;
            if (this.isTerrainLoaded()) {
              height = viewer.scene.globe.getHeight(cartographic);
            }

            // 更新弹窗位置
            that.selectedEntityHighDiy = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);

            // that.popupData = entity.properties;

            // 解析 properties 以获取实际的数据
            let properties = {};
            entity.properties.propertyNames.forEach(name => {
              properties[name] = entity.properties[name].getValue();
            });
            that.popupData = properties;
            console.log("entity.properties作为弹窗数据:", that.popupData);

            this.popupVisible = true;
            this.updatePopupPosition();
          } else {
            this.popupVisible = false;
          }

          // 处理面实体
          if (entity._polygon) {
            that.showPolygon = true;
          } else {
            that.showPolygon = false;
          }

          // 处理线实体
          if (entity._polyline) {
            let status = cesiumPlot.drawPolylineStatus();
            that.showPolyline = (status === 0);
          } else {
            that.showPolyline = false;
          }
        } else {
          this.popupVisible = false;
        }

      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 确保在地图拖动时弹窗位置更新
      window.viewer.screenSpaceEventHandler.setInputAction(movement => {
        if (that.popupVisible && window.selectedEntity) {
          that.updatePopupPosition();
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
  }
}
</script>

<style scoped>
.tool-container {
  position: absolute;
  padding: 15px;
  border-radius: 5px;
  top: 10px;
  left: 10px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
}
#cesiumContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>

