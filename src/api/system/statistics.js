import request from '@/utils/request'

export function getYaanAftershockStatistics(data) {
    return request({
        url: '/statistics/getYaanAftershockStatistics',
        method: 'post',
        data
    })
}

export function exportExcel(data) {
    return request({
        url: '/statistics/exportExcel',
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

export function getYaanCasualties(data) {
    return request({
        url: '/statistics/getData',
        method: 'post',
        data
    })
}
