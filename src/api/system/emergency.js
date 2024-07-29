import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi";

export function getDisasterReserves(query) {
    return request({
        url: '/system/emergency/getEmergency',
        method: 'get',
        params: query
    })
}
