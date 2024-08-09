import request from '@/utils/request'

export function getYaanAftershockStatistics(data) {
    return request({
        url: '/excel/getYaanAftershockStatistics',
        method: 'post',
        data
    })
}

export function exportExcel(data) {
    return request({
        url: '/excel/exportExcel',
        method: 'post',
        responseType: 'blob', // 确保响应类型为blob
        data
    })
}

export function getField() {
    return request({
        url: '/Field',
        method: 'GET',
    });
}

export function getData(data) {
    return request({
        url: '/excel/getData',
        method: 'post',
        data
    })
}
export function getExcelUploadByTime(params) {
    return request({
        url: '/excel/getExcelUploadByTime',
        method: 'post',
        params
    })
}
