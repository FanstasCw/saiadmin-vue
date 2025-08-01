import { request } from '@/utils/request.js'

/**
 * 币本位机器人日志 API接口
 */
export default {

  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/app/botadmin/CoinbotLogs/index',
      method: 'get',
      params
    })
  },

  /**
   * 添加数据
   * @returns
   */
  save(params = {}) {
    return request({
      url: '/app/botadmin/CoinbotLogs/save',
      method: 'post',
      data: params
    })
  },

  /**
   * 更新数据
   * @returns
   */
  update(id, data = {}) {
    return request({
      url: '/app/botadmin/CoinbotLogs/update?id=' + id,
      method: 'put',
      data
    })
  },

  /**
   * 读取数据
   * @returns
   */
  read(id) {
    return request({
      url: '/app/botadmin/CoinbotLogs/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/app/botadmin/CoinbotLogs/destroy',
      method: 'delete',
      data
    })
  },

}