import request from "@/utils/request.js";

export function getWay(data) {
    return request({
        url: '/map_test/way',
        method: 'post',
        data: data
    })
}