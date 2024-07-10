import Polyline from "./Polyline";
import Polygon from "./Polygon";
import Point from "./Point"
import * as Cesium from 'cesium'

let cesiumPlot= {
  viewer:null,
  ws:null,
  // 初始化viewer和ws
  init(viewer,ws,store) {
    this.viewer = viewer
    this.ws = ws
    this.store = store
    this.initDrawEdit();
  },
  // 初始化点线面对象
  initDrawEdit() {
    this.point = new Point(this.viewer,this.store)
    this.polyline = new Polyline(this.viewer,this.ws)
    this.polygon = new Polygon(this.viewer,this.ws)
  },

  //------------------------------点---------------------------------
  initPointHandler(pointType,img,eqid){
    return this.point.initPointHandlder(pointType,img,eqid)
  },

  drawPoint(pointInfo){
    this.point.drawPoint(pointInfo)
  },

  deletePoint(point){
    this.point.deletePoint(point)
  },
  //----------------------------------------------------------------

  //------------------------------线---------------------------------
  drawActivatePolyline(type,img,eqid) {
    let material = this.getMaterial(type,img)
    this.polyline.activate(material,type,img,eqid)
  },
  deletePolyline(polyline){
    this.polyline.deletePolyline(polyline)
  },
  getDrawPolyline(polylineArr){
    this.polyline.getDrawPolyline(polylineArr,this.getMaterial)
  },
  // 返回画线时的状态，0:未激活 1:绘制，不加这个条件会触发this.showPolyline,导致删除线按钮一直出现
  drawPolylineStatus() {
    return this.polyline.status
  },
  // 选择当前线的material
  getMaterial(type,img) {
    if(type==="量算"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      return NORMALLINE
    }
    if(type==="地裂缝"||type==="可用供水管网"||type==="不可用供水管网"){
      let PICTURELINE = new Cesium.ImageMaterialProperty({
        image: img,
        repeat: new Cesium.Cartesian2(3, 1),
      })
      return PICTURELINE
    }
    if(type==="可通行公路"||type==="限制通行公路"||type==="不可通行公路"){
      let color = null
      if(type==="可通行公路"){
        color = Cesium.Color.fromBytes(158,202,181)
      }else if(type==="限制通行公路"){
        color = Cesium.Color.fromBytes(206,184,157)
      }else{
        color = Cesium.Color.fromBytes(199,151,149)
      }
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: color,
        dashPattern: parseInt("110000001111", 1),
      })
      return NORMALLINE
    }
    if(type==="可通行铁路"||type==="不可通行铁路"){
      let gapColor
      if(type==="可通行铁路"){
        gapColor = Cesium.Color.BLACK
      }else {
        gapColor = Cesium.Color.RED
      }
      let DASHLINE= new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.WHITE,
        gapColor: gapColor,
        dashLength: 100
      })
      return DASHLINE
    }
    if(type==="可用输电线路"||type==="不可用输电线路"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      return NORMALLINE
    }
    if(type==="可用输气管线"||type==="不可用输气管线"){
      let NORMALLINE = new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.CYAN,
        dashPattern: parseInt("110000001111", 1),
      })
      return NORMALLINE
    }
  },
  //-----------------------------------------------------------------

  //------------------------------面---------------------------------
  drawActivatePolygon() {
    this.polygon.activate()
  },
  deletePolygon(polygon){
    this.polygon.deletePolygon(polygon)
  },
  getDrawPolygon(polygonArr){
    this.polygon.getDrawPolygon(polygonArr)
  }
  //----------------------------------------------------------------


}
export default cesiumPlot;
