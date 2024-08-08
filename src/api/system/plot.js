import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

export function getPloy(query) {
  return request({
    url: '/system/ploy/geteqploy',
    method: 'get',
    params: query
  })
}

// 新增标绘图片
export function addPlotIcon(data) {
  return request({
    url: '/system/ploy/addploticon',
    method: 'post',
    data: data
  })
}
// 删除单个标绘图片
export function deletePlotIcon(query) {
  return request({
    url: '/system/ploy/deleteploticon',
    method: 'get',
    params: query
  })
}
// 新增标绘图片
export function updataPlotIcon(data) {
  return request({
    url: '/system/ploy/updataploticon',
    method: 'post',
    data: data
  })
}
// 查询全部标绘图片
export function getPlotIcon(query) {
  return request({
    url: '/system/ploy/getploticon',
    method: 'get',
  })
}

//-------------------------------------------------------------
export function insertPlotAndInfo(data){
  return request({
    url: '/system/ploy/insertplotandinfo',
    method: 'post',
    data: data
  })
}

export function getPlot(query) {
  return request({
    url: '/system/ploy/getplot',
    method: 'get',
    params: query
  })
}

export function getPlotInfos(query) {
  return request({
    url: '/system/ploy/getplotinfos',
    method: 'get',
    params: query
  })
}

export function addPlotInfo(data){
  return request({
    url: '/system/ploy/addplotinfo',
    method: 'post',
    data: data
  })
}

export function deletePlotAndInfo(query) {
  return request({
    url: '/system/ploy/deleteplotandinfo',
    method: 'get',
    params: query
  })
}

export function deletePlotInfo(query) {
  return request({
    url: '/system/ploy/deleteplotinfo',
    method: 'get',
    params: query
  })
}

export function updataPlotInfo(data){
  return request({
    url: '/system/ploy/updataplotinfo',
    method: 'post',
    data: data
  })
}

export function getPlotwithStartandEndTime(data){
  return request({
    url: '/system/ploy/getplotswithtime' ,
    method: 'post',
    params:data
  })
}

export function getLastPlotInfoofCurrentTime(plotid, currentTime){
  return request({
    url: '/system/ploy/getLastPlotInfoofCurrentTime' ,
    method: 'post',
    params: {
      plotid: plotid,
      currentTime: currentTime
    }
  })
}