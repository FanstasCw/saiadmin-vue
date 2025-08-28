import { request } from '@/utils/request.js'

/**
 * 币本位套利机器人 API接口
 */
export default {
  /**
   * 获取正在运行机器人的数量
   * @returns
   */
  getBotCount() {
    return request({
      url: '/bot/statistics/botCount',
      method: 'get'
    })
  },
  /**
   * 获取机器人数据
   * @returns
   */
  getBotData() {
    return request({
      url: '/bot/statistics/botData',
      method: 'get'
    })
  },

  getProfit(id) {
    return request({
      url: '/bot/statistics/profit?id=' + id,
      method: 'get'
    })
  }
}
