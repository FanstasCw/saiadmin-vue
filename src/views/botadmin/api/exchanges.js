import { request } from '@/utils/request.js'

/**
 * 交易所管理 API接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/bot/exchange/index',
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
      url: '/bot/exchange/save',
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
      url: '/bot/exchange/update?id=' + id,
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
      url: '/bot/exchange/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/bot/exchange/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 更改数据状态
   * @returns
   */
  changeActive(data = {}) {
    return request({
      url: '/bot/exchange/changeActive',
      method: 'post',
      data
    })
  }
}
