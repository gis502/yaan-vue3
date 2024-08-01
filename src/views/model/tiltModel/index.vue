<template>
  <div>
    <div id="cesiumContainer" v-if="pageStatus">
      <el-form class="tool-container-1">
        <el-row>
          <div class="modelAdj">模型调整</div>
          <el-button type="primary" @click="find">找到模型</el-button>
          <el-button type="primary" @click="showArrow">{{ showArrowText }}</el-button>
          <!--        <el-button class="el-button--primary" @click="isTerrainLoaded">地形是否加载</el-button>-->
          <el-button type="primary" @click="hide">{{ modelStatusContent }}</el-button>
          <!--        <el-button type="primary" @click="openDialog('新增')">新增模型</el-button>-->
          <el-button type="primary" @click="updataPosition">更新位置</el-button>
        </el-row>
      </el-form>
      <el-form class="button-container">
        <div class="modelAdj">模型选择</div>
        <!--      <el-button class="el-button&#45;&#45;primary" size="small" @click="selectModel(1)">0.4平方公里模型</el-button>-->
        <!--      <el-button class="el-button&#45;&#45;primary" size="small" @click="selectModel(2)">7.37平方公里模型</el-button>-->
        <!--      <el-button class="el-button&#45;&#45;primary" size="small" @click="home">雅安</el-button>-->
        <el-table :data="tableData" style="width: 100%;margin-bottom: 5px" :header-cell-style="tableHeaderColor"
                  :cell-style="tableColor" @row-click="">
          <el-table-column prop="name" label="模型名称">
            <!--          <template #default="scope">-->
            <!--            <el-input v-if="scope.row.show" v-model="modelInfo.name" class="w-50 m-2" placeholder="Please Input"/>-->
            <!--          </template>-->
          </el-table-column>
          <el-table-column prop="path" label="模型路径" width="">
            <!--          <template #default="scope">-->
            <!--            <el-input v-if="scope.row.show" v-model="modelInfo.path" class="w-50 m-2" placeholder="Please Input"/>-->
            <!--          </template>-->
          </el-table-column>
          <!--        <el-table-column prop="rz" label="旋转角度" width=""></el-table-column>-->
          <el-table-column prop="tz" label="模型高度" width=""></el-table-column>
          <!--        <el-table-column prop="rze" label="旋转角度（三维）" width=""></el-table-column>-->
          <el-table-column prop="tze" label="模型高度（三维）" width=""></el-table-column>
          <el-table-column label="操作" min-width="120" align="center">
            <!--          <template #default="scope">-->
            <!--            <el-button v-if="!scope.row.show" type="text" :icon="Edit" @click="updataM(scope.row)">修改</el-button>-->
            <!--            <el-button v-if="!scope.row.show" type="text" :icon="Edit" @click="selectModel(scope.row.path)">查看</el-button>-->
            <!--            <el-button v-if="!scope.row.show" type="text" :icon="Delete" @click="deleteM(scope.row)">删除</el-button>-->
            <!--            <el-button v-if="scope.row.show" type="text" :icon="Edit" @click="updataMCommit(scope.row)">确认</el-button>-->
            <!--          </template>-->
            <template #default="scope">
              <el-button type="text" :icon="Edit" @click="goModel(scope.row)">查看</el-button>
            </template>
          </el-table-column>
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
      <el-form class="tool-container">
        <el-row>
          <!--        <br>-->
          <span style="color: white">调整高度</span>
          <el-slider
              v-model="tz"
              show-input
              :max="2000"
              :min="-2000"
              :step="10"
              @change="changeHeight(tz)"
          >
          </el-slider>
        </el-row>
        <el-row>
          <!--        <br>-->
          <span style="color: white">绕Z轴旋转模型</span>
          <el-slider
              v-model="rz"
              show-input
              :max="180"
              :min="-180"
              :step="1"
              @change="changeRotationZ(rz)"
          >
          </el-slider>
        </el-row>
        <el-row>
          <!--        <br>-->
          <span style="color: white">调整模型透明度</span>
          <el-slider
              v-model="opacity"
              show-input
              :max="100"
              :min="0"
              :step="1"
              @change="changeOpacity(opacity)"
          >
          </el-slider>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span style="color: white">经度：<span id="longitudeShow"></span>°</span>
          </el-col>
          <el-col :span="8">
            <span style="color: white">纬度：<span id="latitudeShow"></span>°</span>
          </el-col>
          <el-col :span="8">
            <span style="color: white">视角高：<span id="altitudeShow"></span>km</span>
          </el-col>
        </el-row>
      </el-form>

      <!--    <el-dialog v-model="dialogFormVisible" title="新增模型" width="500" :show-close="false">-->
      <!--      <el-form :model="modelInfo">-->
      <!--        <el-form-item label="模型名称">-->
      <!--          <el-input v-model="modelInfo.name" autocomplete="off"/>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="模型路径">-->
      <!--          <el-input v-model="modelInfo.path" autocomplete="off"/>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <!--      <template #footer>-->
      <!--        <div class="dialog-footer">-->
      <!--          <el-button @click="closeDialog">Cancel</el-button>-->
      <!--          <el-button type="primary" @click="commitDialog">-->
      <!--            Confirm-->
      <!--          </el-button>-->
      <!--        </div>-->
      <!--      </template>-->
      <!--    </el-dialog>-->

  </div>
    <!--  <div v-if="!pageStatus">-->
    <!--    <tiltTable />-->
    <!--  </div>-->
  </div>

</template>

<script setup>
import * as Cesium from 'cesium'
import CesiumNavigation from "cesium-navigation-es6";
import {initCesium} from '@/cesium/tool/initCesium.js'
import {Edit, Delete} from '@element-plus/icons-vue'
import {addModelApi, deleteModel, getAllModel, updataModel,updataModelNoElevation,updataModelElevation} from '@/api/system/model.js'
// import tiltTable from '@/components/Model/tiltModel/tiltTable.vue'
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import {CustomShader} from "cesium";

let pageStatus = ref(true)
let tz = ref(0)
let rz = ref(0)
let originRz = 0
let originTz = 0
let opacity = ref(100)
let showArrowValue = false
let showArrowText = ref("显示坐标轴")
let modelStatus = true
let modelStatusContent = ref("隐藏当前模型")
let modelName = ''
//----------------------------model table---------------------------------------
let currentPage = ref(1)
let pageSize = ref(5)
let total = ref(0)
let modelList = []
let tableData = ref([])
//------------------------------dialog对话框--------------------------------------
let title = ref("")
let dialogFormVisible = ref(false)
let modelInfo = reactive({
  name: null, path: null, rz: null, tz: null, rze: null, tze: null, time: null, modelid: null
})
//-------------------------------------------------------------------------------

onMounted(() => {
  init()
  watchTerrainProviderChanged()
  initModelTable()
})

// 初始化控件等
function init() {
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
  // document.getElementsByClassName('navigation-control-icon-zoom-in')[0].style.color = '#409EFF'
  // document.getElementsByClassName('navigation-control-icon-zoom-out')[0].style.color = '#409EFF'
  document.getElementsByClassName('cesium-geocoder-input')[0].placeholder = '请输入地名进行搜索'
  document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[0].innerHTML = '影像服务'
  document.getElementsByClassName('cesium-baseLayerPicker-sectionTitle')[1].innerHTML = '地形服务'
  // document.getElementsByClassName('cesium-viewer-cesiumInspectorContainer')[0].style.top = '300px'
  // document.getElementsByClassName('cesium-viewer-cesium3DTilesInspectorContainer')[0].style.top = '600px'
  // 设置鼠标位置经纬度\视角高度实时显示
  let longitudeShow = document.getElementById('longitudeShow');
  let latitudeShow = document.getElementById('latitudeShow');
  let altitudeShow = document.getElementById('altitudeShow');
  let canvas = viewer.scene.canvas;
  //具体事件的实现
  let ellipsoid = viewer.scene.globe.ellipsoid;
  let handler = new Cesium.ScreenSpaceEventHandler(canvas);
  handler.setInputAction(function (movement) {
    //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    if (cartesian) {
      //将笛卡尔三维坐标转为地图坐标（弧度）
      let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      //将地图坐标（弧度）转为十进制的度数
      let latString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
      let logString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
      // 获取相机的海拔高度作为视角高度/km
      let altiString = (viewer.camera.positionCartographic.height / 1000).toFixed(2);
      longitudeShow.innerHTML = logString;
      latitudeShow.innerHTML = latString;
      altitudeShow.innerHTML = altiString;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

function hide() {
  if (modelStatus) {
    window.modelObject.show = false
    modelStatus = false
    modelStatusContent.value = '显示当前模型'
  } else {
    window.modelObject.show = true
    modelStatus = true
    modelStatusContent.value = '隐藏当前模型'
  }
}

// cesium自身接口scene.terrainProviderChanged(只读),当地形发生变化时(添加高程)触发
// 不能用watch来监视scene.terrainProviderChanged,会造成堆栈溢出（内存溢出）
function isTerrainLoaded() {
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
}

function watchTerrainProviderChanged() {
  window.viewer.scene.terrainProviderChanged.addEventListener(terrainProvider => {
    if (isTerrainLoaded()) {
      changeHeight(modelInfo.tze)
      tz.value = modelInfo.tze
      find()
    } else {
      changeHeight(modelInfo.tz)
      tz.value = modelInfo.tz
      find()
    }
  });
}

function selectGltfModel() {
  remove3dData()
  tz.value = 0
  originTz = 0

  let cartesian = new Cesium.Cartesian3.fromDegrees(103.00, 29.98, 0.0)
  let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);

  let model = Cesium.Model.fromGltf({
    url: './peilou/万达.gltf',
    modelMatrix: modelMatrix,
    id: 'wanda',
    minimumPixelSize: 128,
    scale: 1,
  })
  window.modelObject = model
  window.viewer.scene.primitives.add(window.modelObject)
  console.log(window.modelObject)
  window.modelObject.readyPromise.then(function () {

    let origin = new Cesium.Cartesian3(0, 0, 1000)
    Cesium.Matrix4.multiplyByPoint(window.modelObject.modelMatrix, origin, origin)
    window.viewer.camera.zoomTo({
      destination: origin,
      orientation: {
        // 指向
        heading: 6.283185307179581,
        // 视角
        pitch: -1.5688168484696687,
        roll: 0.0
      }
    });
  })

}

function selectModel(modelName) {
  remove3dData()
  initModel(modelName)
  // window.viewer.zoomTo(
  //     window.modelObject
  // )
  window.viewer.zoomTo(window.modelObject)
  modelStatus = true
  modelStatusContent.value = "隐藏当前模型"
}

/**
 * @Description:初始化加载模型并贴地
 * @author White Mo
 * @date 2024/3/25
 */
function initModel(modelName) {

  let baseURL = import.meta.env.VITE_APP_API_URL

  const customShader = new CustomShader({
    lightingModel:0
  })

  const tileset = new Cesium.Cesium3DTileset({
    url: baseURL + "/geoserver/www/" + modelName + "/tileset.json",
    loadSiblings: true,
    show: true,
    maximumScreenSpaceError: 64,//默认16，值越大经度越小
    maximumMemoryUsage: 3000,//可用于缓存瓦片的最大GPU内存量（以MB为单位）
    skipLevelOfDetail: true,
    preferLeaves: true,
    customShader: customShader
  });

  //如果遇到url中特殊字符+问题，前往node_modules\cesium\Source\ThirdParty\uri.js修改'%2B': '+'为'%2B': '%2B',禁止将json中的%2B转为+，因为geoserver无法识别+路径
  window.modelObject = tileset
  tileset.zIndex = -1;
  tileset.readyPromise.then(function () {
    window.viewer.scene.primitives.add(tileset);
    console.log("模型已加载")
    if (isTerrainLoaded()) {
      changeHeight(modelInfo.tze)
      tz.value = modelInfo.tze
      find()
    } else {
      // tz.value = modelInfo.tz
      // changeHeight(modelInfo.tz)
      // find()
      const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);//获取模型高度
      tz.value = 20 - Math.trunc(cartographic.height)//高度取整
      transferModel(tileset, 0, 0, tz.value, 0, 0, 0, 1, 1)//模型贴地
      console.log(tz.value, Math.trunc(cartographic.height), 123)
    }
  })

}

/**
 * @Description: 调用模型更改函数更改高度
 * @author White Mo
 * @date 2024/3/22
 */
function changeHeight(_tz) {
  transferModel(window.modelObject, 0, 0, _tz, opacity.value)
}

/**
 * @Description: 调用模型更改函数更改透明度
 * @author White Mo
 * @date 2024/3/22
 */
function changeOpacity(_opacity) {
  transferModel(window.modelObject, 0, 0, tz.value, _opacity)
}

/**
 * @Description: 调用模型更改函数绕Z轴旋转
 * @author White Mo
 * @date 2024/3/22
 */
function changeRotationZ(rz) {
  rotationModel(window.modelObject, rz)
}

/**
 * @Description: 使用矩阵更改模型位置，平移模型
 * @author White Mo
 * @date 2024/3/22
 */
function transferModel(model, _tx, _ty, _tz, _opacity) {
  if (!checkModelLoad()) {
    return
  }
  console.log("_opacity", _opacity)
  let tx = _tx ? _tx : 0;
  let ty = _ty ? _ty : 0;
  let tz = _tz ? _tz : 0;
  let opacity = _opacity ? _opacity / 100 : 1

  if (model instanceof Cesium.Cesium3DTileset) {
    const origin = model.boundingSphere.center;
    const m = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//获取到以模型中心为原点,Z轴垂直地表的局部坐标系，以矩阵表示
    //平移
    const tempTranslation = new Cesium.Cartesian3(tx, ty, tz);//平移向量
    const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));//将局部坐标中（0，0，0）平移到（tx,ty,tz)后的世界坐标系中终点坐标
    const translation = Cesium.Cartesian3.subtract(offset, origin, new Cesium.Cartesian3());//终点世界坐标减去原点世界坐标得到世界坐标系下平移向量
    model.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    // 透明度
    model.style = new Cesium.Cesium3DTileStyle({
      color: "color('rgba(255,255,255," + opacity + ")')",
    });
  } else if (model instanceof Cesium.Model) {
    let origin = new Cesium.Cartesian3(0, 0, 0)
    Cesium.Matrix4.multiplyByPoint(model.modelMatrix, origin, origin)
    console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(origin).latitude))
    console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(origin).longitude))
    console.log(Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(origin).height))
    const m = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//获取到以模型中心为原点,Z轴垂直地表的局部坐标系，以矩阵表示

    //平移
    const tempTranslation = new Cesium.Cartesian3(tx, ty, tz - originTz);//平移向量
    const offset = Cesium.Matrix4.multiplyByPoint(m, tempTranslation, new Cesium.Cartesian3(0, 0, 0));//将局部坐标中（0，0，0）平移到（tx,ty,tz)后的世界坐标系中终点坐标

    const translation = Cesium.Cartesian3.subtract(offset, origin, new Cesium.Cartesian3());//终点世界坐标减去原点世界坐标得到世界坐标系下平移向量
    Cesium.Matrix4.multiply(Cesium.Matrix4.fromTranslation(translation), model.modelMatrix, model.modelMatrix)
    originTz = tz
  }

}

/**
 * @Description: 模型绕垂直地面的Z轴旋转,先将模型平移到地心，然后将局部坐标Z轴与世界坐标Z轴对齐，进行旋转，再恢复原本Z轴朝向，平移回原位置   矩阵乘法顺序为T2R2RR1T1M0
 * @author White Mo
 * @date 2024/3/26
 */
function rotationModel(tileset, rz) {

  if (!checkModelLoad()) {
    return
  }
  const origin = tileset.boundingSphere.center;
  console.log("初始世界坐标", origin)
  const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);//获取到以模型中心为原点,Z轴垂直地表的局部坐标系的变换矩阵，左乘此矩阵可以将局部坐标变换为世界坐标
  const originMatrix = tileset.modelMatrix//贴地变换矩阵或者初始变换矩阵M0
  console.log("当前坐标变换矩阵", localToWorldMatrix)
  const backToEarthCenter = new Cesium.Cartesian3(-origin.x, -origin.y, -origin.z)//回到地心位移量
  let backToEarthCenterMatrix = Cesium.Matrix4.fromTranslation(backToEarthCenter);//回到地心变换矩阵
  Cesium.Matrix4.multiply(backToEarthCenterMatrix, originMatrix, backToEarthCenterMatrix)//贴地变换矩阵左乘回到地心矩阵 T1M0
  console.log("回到地心变换矩阵", backToEarthCenterMatrix)
  // 旋转
  //旋转模型使得Z轴与世界坐标Z轴重合
  let arrowX = new Cesium.Cartesian3(1, 0, 0)
  let arrowY = new Cesium.Cartesian3(0, 1, 0)
  let arrowZ = new Cesium.Cartesian3(0, 0, 1)
  let localArrowX = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, new Cesium.Cartesian3(1, 0, 0), new Cesium.Cartesian3)
  let localArrowY = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, new Cesium.Cartesian3(0, 1, 0), new Cesium.Cartesian3)
  let localArrowZ = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, new Cesium.Cartesian3(0, 0, 1), new Cesium.Cartesian3)
  let angleToXZ = Cesium.Cartesian3.angleBetween(arrowX, new Cesium.Cartesian3(localArrowZ.x, localArrowZ.y, 0))//局部Z轴在世界坐标系XY平面上投影到X轴角度，即绕Z顺时针旋转这个角度可以到XZ平面上
  let angleToZ = Cesium.Cartesian3.angleBetween(localArrowX, arrowZ)//然后绕Y轴顺时针旋转此角度可使得Z轴与世界坐标系Z轴重合
  const rotationAngleToXZ = Cesium.Matrix3.fromRotationZ(-angleToXZ);//此函数正方向为逆时针
  const rotationAngleToZ = Cesium.Matrix3.fromRotationY(-angleToZ);
  let rotationAngleToZMatrix = Cesium.Matrix3.multiply(rotationAngleToZ, rotationAngleToXZ, new Cesium.Matrix3)
  rotationAngleToZMatrix = Cesium.Matrix4.fromRotationTranslation(rotationAngleToZMatrix)
  Cesium.Matrix4.multiply(rotationAngleToZMatrix, backToEarthCenterMatrix, rotationAngleToZMatrix)//局部轴校正R1T1M0


  // 绕Z轴旋转
  console.log(rz - originRz)
  const rotationZ = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rz - originRz)); // 绕Z轴旋转变换矩阵R
  let rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotationZ)
  Cesium.Matrix4.multiply(rotationMatrix, rotationAngleToZMatrix, rotationMatrix)//RR1T1M0

  // 旋转模型回到原本朝向
  const rotationAngleLeaveXZ = Cesium.Matrix3.fromRotationZ(angleToXZ);
  const rotationAngleLeaveZ = Cesium.Matrix3.fromRotationY(angleToZ);
  let rotationAngleLeaveZMatrix = Cesium.Matrix3.multiply(rotationAngleLeaveXZ, rotationAngleLeaveZ, new Cesium.Matrix3)
  rotationAngleLeaveZMatrix = Cesium.Matrix4.fromRotationTranslation(rotationAngleLeaveZMatrix)// 局部Z轴回到原本方向
  Cesium.Matrix4.multiply(rotationAngleLeaveZMatrix, rotationMatrix, rotationAngleLeaveZMatrix)//R2RR1T1M0

  //回到原来位置
  const backToOriginMatrix = Cesium.Matrix4.fromTranslation(origin);//从地心回归原位T2
  // 应用变换矩阵

  const lastMatrix = Cesium.Matrix4.multiply(backToOriginMatrix, rotationAngleLeaveZMatrix, new Cesium.Matrix4)//最终矩阵T2R2RR1T1M0

  tileset.modelMatrix = lastMatrix
  console.log("结束世界坐标", tileset.boundingSphere.center)
  originRz = rz

}

function remove3dData() {
  window.viewer.scene.primitives.remove(window.modelObject)
  window.modelObject = null
}

function home() {
  remove3dData()
  viewer.camera.setView({
    // Cesium的坐标是以地心为原点，一向指向南美洲，一向指向亚洲，一向指向北极州
    // fromDegrees()方法，将经纬度和高程转换为世界坐标
    destination: Cesium.Cartesian3.fromDegrees(103.00, 29.98, 1500),
    orientation: {
      // 指向
      heading: 6.283185307179581,
      // 视角
      pitch: -1.5688168484696687,
      roll: 0.0
    }
  });
}

function find() {
  if (checkModelLoad()) {
    if (window.modelObject instanceof Cesium.Cesium3DTileset) {
      window.viewer.zoomTo(window.modelObject)
    } else if (window.modelObject instanceof Cesium.Model) {
      let origin = new Cesium.Cartesian3(0, 0, 1000)
      Cesium.Matrix4.multiplyByPoint(window.modelObject.modelMatrix, origin, origin)
      window.viewer.camera.zoomTo({
        destination: origin,
        orientation: {
          // 指向
          heading: 6.283185307179581,
          // 视角
          pitch: -1.5688168484696687,
          roll: 0.0
        }
      });
    }
  }
}

function showArrow() {
  viewer.entities.removeAll()
  if (!showArrowValue) {
    let origin = window.modelObject.boundingSphere.center
    const localToWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
    let localX = new Cesium.Cartesian3(100, 0, 0)
    let localY = new Cesium.Cartesian3(0, 100, 0)
    let localZ = new Cesium.Cartesian3(0, 0, 100)
    let localToWorldX = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, localX, new Cesium.Cartesian3)
    let localToWorldY = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, localY, new Cesium.Cartesian3)
    let localToWorldZ = Cesium.Matrix4.multiplyByPoint(localToWorldMatrix, localZ, new Cesium.Cartesian3)
    viewer.entities.add({
      name: "localX",
      position: localToWorldX,
      polyline: {
        positions: [origin, localToWorldX],
        width: 25,
        arcType: Cesium.ArcType.NONE,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
      },
      label: {
        text: 'X轴 正东方向',
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9)
      }
    });
    viewer.entities.add({
      name: "localY",
      position: localToWorldY,
      polyline: {
        positions: [origin, localToWorldY],
        width: 25,
        arcType: Cesium.ArcType.NONE,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
      },
      label: {
        text: 'Y轴 正北方向',
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9)
      }
    });
    viewer.entities.add({
      name: "localZ",
      position: localToWorldZ,
      polyline: {
        positions: [origin, localToWorldZ],
        width: 25,
        arcType: Cesium.ArcType.NONE,
        material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.YELLOW),
      },
      label: {
        text: 'Z轴 垂直地面',
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9)
      }
    });
    showArrowValue = true
    showArrowText.value = "隐藏坐标轴"
  } else {
    showArrowValue = false
    showArrowText.value = "显示坐标轴"
  }
}

function checkModelLoad() {
  if (window.modelObject)
    return true
  else
      // $confirm('未加载模型', '提示', {
      //   confirmButtonText: '确定',
      //   type: 'warning',
      //   center: true
      // }).then(function () {
      //   rz = 0
      //   originRz = 0
      //   originTz = 0
      //   opacity = 100
      // })
    return false
}

//-----------------------模型table----------------------------

// 初始化模型table数据
function initModelTable() {
  getAllModel().then(res => {
    modelList = res
    total.value = res.length
    tableData.value = getPageArr(modelList)
    console.log(modelList, tableData)
  })
}

// 修改table的header的样式
function tableHeaderColor() {
  return {
    'border-color': '#293038',
    'background-color': '#293038 !important', // 此处是elemnetPlus的奇怪bug，header-cell-style中背景颜色不加!important不生效
    'color': '#fff',
    'padding': '0',
    'text-align': 'center',
  }
}

// 修改table 中每行的样式
function tableColor({row, column, rowIndex, columnIndex}) {
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
}

//数组切片
function getPageArr(data) {
  let arr = []
  let start = (currentPage.value - 1) * pageSize.value
  let end = currentPage.value * pageSize.value
  if (end > total.value) {
    end = total.value
  }
  for (; start < end; start++) {
    data[start].show = false
    arr.push(data[start])
  }
  return arr
}

//`每页 ${val} 条`
function handleSizeChange(val) {
  pageSize.value = val
  tableData.value = getPageArr(modelList)
  // console.log(`每页 ${val} 条`);
}

// `当前页: ${val}`
function handleCurrentChange(val) {
  currentPage.value = val
  tableData.value = getPageArr(modelList)
  // console.log(`当前页: ${val}`);
}

//-----------------------------------------------------------

function goModel(row){
  modelInfo.name = row.name
  modelInfo.path = row.path
  modelInfo.tz = row.tz
  modelInfo.rz = row.rz
  modelInfo.time = row.time
  modelInfo.modelid = row.modelid
  modelInfo.tze = row.tze
  modelInfo.rze = row.rze
  selectModel(row.path)
}

// 更新模型位置
function updataPosition(){
  if(isTerrainLoaded()){
    let data = {
      rze: rz.value,
      tze: tz.value,
      modelid: modelInfo.modelid
    }
    updataModelElevation(data).then(res=>{
      ElMessage({
        showClose: true,
        message: '加载地形情况下，更新成功',
        type: 'success',
        duration: 2000,
      })
      initModelTable()
    })
  }else{
    let data = {
      rz: rz.value,
      tz: tz.value,
      modelid: modelInfo.modelid
    }
    updataModelNoElevation(data).then(res=>{
      ElMessage({
        showClose: true,
        message: '不加载地形情况下，更新成功',
        type: 'success',
        duration: 2000,
      })
      initModelTable()
    })
  }
}

// 打开对话框
function openDialog(titleM, row) {
  if (titleM === "新增") {
    title.value = "新增"
    modelInfo.rz = 0
    modelInfo.tz = 0
    modelInfo.time = '1717743010164'
    modelInfo.modelid = Date.now()
  } else {
    modelInfo.rz = 0
    modelInfo.tz = 0
    modelInfo.time = '1717743010164'
    modelInfo.modelid = row.modelid
    modelInfo.name = row.name
    modelInfo.path = row.path
    title.value = "编辑"
  }
  dialogFormVisible.value = true

}

// 关闭对话框
function closeDialog() {
  for (let key in modelInfo) {
    modelInfo[key] = null
  }
  dialogFormVisible.value = false
}

// 确认提交对话框，添加模型
function commitDialog() {
  let data = {
    name: modelInfo.name,
    path: modelInfo.path,
    rz: modelInfo.rz,
    tz: modelInfo.tz,
    rze: modelInfo.rze,
    tze: modelInfo.tze,
    time: modelInfo.time,
    modelid: modelInfo.modelid
  }
  if (title.value === "新增") {
    addModelApi(data).then(res => {
      initModelTable()
      for (let key in modelInfo) {
        modelInfo[key] = null
      }
    })
  }
  // else{
  //   updataModel(data).then(res=>{
  //     initModelTable()
  //     for(let key in modelInfo){
  //       modelInfo[key] = null
  //     }
  //     console.log(res,'编辑')
  //   })
  // }
  dialogFormVisible.value = false
}

// 删除模型
function deleteM(row) {
  deleteModel({modelid: row.modelid}).then(res => {
    initModelTable()
  })
}

// 修改模型
function updataM(row) {
  modelInfo.name = row.name
  modelInfo.path = row.path
  modelInfo.tz = row.tz
  modelInfo.rz = row.rz
  modelInfo.time = row.time
  modelInfo.modelid = row.modelid
  modelInfo.tze = row.tze
  modelInfo.rze = row.rze
  // row.show = !row.show
}

function updataMCommit() {
  let data = {
    name: modelInfo.name,
    path: modelInfo.path,
    rz: modelInfo.rz,
    tz: modelInfo.tz,
    rze: modelInfo.rze,
    tze: modelInfo.tze,
    time: modelInfo.time,
    modelid: modelInfo.modelid
  }
  updataModel(data).then(res => {
    initModelTable()
    for (let key in modelInfo) {
      modelInfo[key] = null
    }
    console.log(res, '编辑')
  })
}
</script>

<style scoped>
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
  height: calc(100vh - 50px);
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

.noteContainer {
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  top: 368px;
  left: 10px;
  width: 500px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
}

.tool-container-1 {
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  width: 525px;
  top: 10px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.tool-container {
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  width: 525px;
  top: 400px;
  left: 10px;
  z-index: 10; /* 更高的层级 */
  background-color: rgba(40, 40, 40, 0.7);
}

.button-container {
  height: 330px;
  width: 525px;
  position: absolute;
  padding: 10px;
  border-radius: 5px;
  top: 65px;
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
  margin-right: 10px;
}
</style>
