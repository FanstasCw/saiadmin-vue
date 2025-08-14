import { request } from '@/utils/request.js'

/**
 * 现货网格机器人 API接口
 */
export default {
  /**
   * 数据列表
   * @returns
   */
  getPageList(params = {}) {
    return request({
      url: '/bot/spotBot/index',
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
      url: '/bot/spotBot/save',
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
      url: '/bot/spotBot/update?id=' + id,
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
      url: '/bot/spotBot/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/bot/spotBot/destroy',
      method: 'delete',
      data
    })
  },

  /**
   * 设置状态
   * @returns
   */
  setActive(data = {}) {
    return request({
      url: '/bot/spotBot/setActive',
      method: 'post',
      data
    })
  },

  /**
   * 获取状态
   * @returns
   */
  getActive(data = {}) {
    return request({
      url: '/bot/spotBot/getActive',
      method: 'post',
      data
    })
  }
}
