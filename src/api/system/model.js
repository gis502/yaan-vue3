import request from '@/utils/request'
export function addModelApi(data) {
    return request({
        url: '/system/model/addmodel',
        method: 'post',
        data: data
    })
}
export function getAllModel(query) {
    return request({
        url: '/system/model/getmodel',
        method: 'get',
    })
}
export function deleteModel(query){
    return request({
        url: '/system/model/deletemodel',
        method: 'get',
        params: query
    })
}
export function updataModel(data) {
    return request({
        url: '/system/model/updatamodel',
        method: 'post',
        data: data
    })
}
export function updataModelNoElevation(data) {
    return request({
        url: '/system/model/updatamodelnoelevation',
        method: 'post',
        data: data
    })
}
export function updataModelElevation(data) {
    return request({
        url: '/system/model/updatamodelelevation',
        method: 'post',
        data: data
    })
}