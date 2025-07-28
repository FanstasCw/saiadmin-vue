import { request } from '@/utils/request.js'

/**
 * 币本位套利机器人 API接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/app/botadmin/CoinBot/index',
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
      url: '/app/botadmin/CoinBot/save',
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
      url: '/app/botadmin/CoinBot/update?id=' + id,
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
      url: '/app/botadmin/CoinBot/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/app/botadmin/CoinBot/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 更改数据状态
   * @returns
   */
  setActive(data = {}) {
    return request({
      url: '/app/botadmin/CoinBot/setActive',
      method: 'post',
      data
    })
  },

  /**
   * 获取启用状态
   * @returns
   */
  getActive(data = {}) {
    return request({
      url: '/app/botadmin/CoinBot/getActive',
      method: 'post',
      data
    })
  }
}
