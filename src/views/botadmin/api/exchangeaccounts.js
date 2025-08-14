import { request } from '@/utils/request.js'

/**
 * 交易所账户管理 API接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/bot/account/index',
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
      url: '/bot/account/save',
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
      url: '/bot/account/update?id=' + id,
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
      url: '/bot/account/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/bot/account/destroy',
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
      url: '/bot/account/changeActive',
      method: 'post',
      data
    })
  }
}
