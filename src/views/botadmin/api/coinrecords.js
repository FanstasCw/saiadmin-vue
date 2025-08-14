import { request } from '@/utils/request.js'
/**
 * 币本位交易记录 API接口
 */
export default {
  showTools: false,
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/bot/coinBotTrade/index',
      method: 'get',
      params
    })
  }
}
