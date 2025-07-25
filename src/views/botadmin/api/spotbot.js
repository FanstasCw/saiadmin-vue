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
      url: '/app/botadmin/SpotGridBot/index',
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
      url: '/app/botadmin/SpotGridBot/save',
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
      url: '/app/botadmin/SpotGridBot/update?id=' + id,
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
      url: '/app/botadmin/SpotGridBot/read?id=' + id,
      method: 'get'
    })
  },

  /**
   * 删除数据
   * @returns
   */
  destroy(data) {
    return request({
      url: '/app/botadmin/SpotGridBot/destroy',
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
      url: '/app/botadmin/SpotGridBot/changeActive',
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
      url: '/app/botadmin/SpotGridBot/getActive',
      method: 'post',
      data
    })
  },
  /**
   * 设置关闭状态
   * @returns
   */
  setClosed(data = {}) {
    return request({
      url: '/app/botadmin/SpotGridBot/setClosed',
      method: 'post',
      data
    })
  },
  /**
   * 获取关闭状态
   * @returns
   */
  getClosed(data = {}) {
    return request({
      url: '/app/botadmin/SpotGridBot/getClosed',
      method: 'post',
      data
    })
  }
}
