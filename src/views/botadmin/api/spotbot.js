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
      url: '/app/botadmin/SpotBot/index',
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
      url: '/app/botadmin/SpotBot/save',
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
      url: '/app/botadmin/SpotBot/update?id=' + id,
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
      url: '/app/botadmin/SpotBot/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/app/botadmin/SpotBot/destroy',
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
      url: '/app/botadmin/SpotBot/setActive',
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
      url: '/app/botadmin/SpotBot/getActive',
      method: 'post',
      data
    })
  }
}
