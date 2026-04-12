// search 相关接口
import axios from './config'

// 获取搜索建议
export const getSuggestList = async (keyword) => {
  return axios.get(`/search?keyword=${keyword}`);
}

export const getHotList = async () => {
  return axios.get('/hotList');
}