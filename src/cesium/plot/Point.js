import * as Cesium from 'cesium'

export default class Point {
  constructor(viewer, store) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    this.store = store
  }
  // 画点的屏幕事件
  initPointHandlder(pointType,img,eqid) {
    return new Promise((resolve, reject)=>{
      let viewer = this.viewer
      let that = this
      that.handler.setInputAction((event) => {
        let pointInfo = {
          latitude: null,
          longitude: null,
          height: null,
          img: null,
          plottype: null,
          plotid: null,
          eqid:eqid
        }
        // 1-1 获取点击的位置的坐标信息（经度、纬度、高度）
        let ray = viewer.camera.getPickRay(event.position)
        let position = viewer.scene.globe.pick(ray, viewer.scene)
        // 1-2 坐标系转换
        let cartographic = Cesium.Cartographic.fromCartesian(position)//把笛卡尔坐标转换成制图实例，单位是弧度
        let lon = Cesium.Math.toDegrees(cartographic.longitude) //把弧度转换成度
        let lat = Cesium.Math.toDegrees((cartographic.latitude))
        let height = cartographic.height
        // 1-3 点开弹窗中就有经纬度，并且把经纬度图片等信息存入store中
        pointInfo.latitude = lat.toFixed(6)
        pointInfo.longitude = lon.toFixed(6)
        pointInfo.height = height
        pointInfo.img = img//that.matchIcon(pointType)
        pointInfo.plottype = pointType//that.refenceTypeList[pointType]
        pointInfo.plotid = that.guid()
        that.store.setPointInfo1(pointInfo)
        // 1-4 异步执行完成
        resolve('异步操作完成');
        // 1-5 移除此handler
        that.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    })
  }
  // 画点
  drawPoint(data) {
    window.viewer.entities.add({
      id: data.plotid,
      position: Cesium.Cartesian3.fromDegrees(Number(data.longitude), Number(data.latitude), Number(data.height)),
      billboard: {
        image: data.img,
        width: 50,//图片宽度,单位px
        height: 50,//图片高度，单位px // 会影响point大小，离谱
        eyeOffset: new Cesium.Cartesian3(0, 0, 0),//与坐标位置的偏移距离
        color: Cesium.Color.WHITE.withAlpha(1),//颜色
        scale: 0.8,//缩放比例
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,// 绑定到地形高度,让billboard贴地
        depthTest: false,//禁止深度测试但是没有下面那句有用
        disableDepthTestDistance: Number.POSITIVE_INFINITY//不再进行深度测试（真神）
      },
      properties: {
        data
      }
    })
  }
  // 删除点
  deletePoint(point){
    viewer.entities.remove(point)
  }
  //匹配图标
  matchIcon(type) {
    let list = matchMark() // 封装的marchMark
    return list[type]
  }

  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
