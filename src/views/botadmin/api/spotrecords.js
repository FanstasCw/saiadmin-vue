import { request } from '@/utils/request.js'

/**
 * 现货交易记录 API接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/app/botadmin/SpotRecords/index',
      method: 'get',
      params
    })
  }
}
