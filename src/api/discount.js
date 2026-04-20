import axios from './config'

export const getDiscountBanners = () => {
  return axios.get('/discount/banners')
}

export const getDiscountList = (page, pageSize = 10) => {
  return axios.get('/discount/list', {
    params: {
      page,
      pageSize
    }
  })
}
