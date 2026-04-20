import Mock from 'mockjs';

// 每页10条数据
const getImages = (page, pageSize = 10) => {
  return Array.from({length:pageSize},(_,i)=>({
    // 索引唯一
    id:`${page}-${i}`,
    height:Mock.Random.integer(200,400),
    url:Mock.Random.image('300x400',Mock.Random.color(),'#fff','trip')
  }))
}

const scenicPool = [
  '西湖',
  '黄山',
  '九寨沟',
  '鼓浪屿',
  '稻城亚丁',
  '丽江古城',
  '三亚蜈支洲岛',
  '洱海',
  '青海湖',
  '张家界国家森林公园'
]

const cityPool = ['杭州', '黄山', '阿坝', '厦门', '甘孜', '丽江', '三亚', '大理', '西宁', '张家界']

const tagPool = ['限时5折', '家庭优选', '周末出发', '双人特惠', '早鸟价', '节假日可用']

const scenicImageMap = {
  西湖: 'https://picsum.photos/seed/xihu/900/1200',
  黄山: 'https://picsum.photos/seed/huangshan/900/1200',
  九寨沟: 'https://picsum.photos/seed/jiuzhaigou/900/1200',
  鼓浪屿: 'https://picsum.photos/seed/gulangyu/900/1200',
  稻城亚丁: 'https://picsum.photos/seed/yading/900/1200',
  丽江古城: 'https://picsum.photos/seed/lijiang/900/1200',
  三亚蜈支洲岛: 'https://picsum.photos/seed/wuzhizhou/900/1200',
  洱海: 'https://picsum.photos/seed/erhai/900/1200',
  青海湖: 'https://picsum.photos/seed/qinghai/900/1200',
  张家界国家森林公园: 'https://picsum.photos/seed/zhangjiajie/900/1200'
}

const getDiscountList = (page, pageSize = 10) => {
  return Array.from({ length: pageSize }, (_, i) => {
    const scenicIndex = ((page - 1) * pageSize + i) % scenicPool.length
    const scenicName = scenicPool[scenicIndex]
    const city = cityPool[scenicIndex]
    const originPrice = Mock.Random.integer(399, 1699)
    const discountPrice = Mock.Random.integer(199, Math.max(originPrice - 30, 260))
    const savePrice = originPrice - discountPrice

    return {
      id: `d-${page}-${i}`,
      scenicName,
      city,
      category: Mock.Random.pick(['门票', '酒店', '度假套餐', '一日游', '亲子游']),
      discountTag: Mock.Random.pick(tagPool),
      originPrice,
      discountPrice,
      savePrice,
      score: Mock.Random.float(4.2, 5, 1, 1),
      soldCount: Mock.Random.integer(120, 4900),
      height: Mock.Random.integer(210, 360),
      url: scenicImageMap[scenicName] || Mock.Random.image(
        '360x520',
        Mock.Random.color(),
        '#fff',
        `${scenicName} ${discountPrice}`
      )
    }
  })
}

export default [
  {
    url: '/api/search',
    method: 'get',
    timeout: 1000,
    response: (req, res) => {
      // ?keyword=xxx
      const keyword = req.query.keyword;
      let num = Math.floor(Math.random() * 10);
      let list = [];
      for (let i = 0; i < num; i++) {
        // 生成随机内容
        const randomData = Mock.mock({
          title: Mock.Random.cword(2, 6),
        })
        console.log(randomData)
        list.push(`${randomData.title}${keyword}`)
      }

      return {
        code: 0,
        data: list
      }
    }
  },
  {
    url: '/api/hotList',
    method: 'get',
    timeout: 1000,
    response: (req, res) => {
      return {
        code: 0,
        data: [{
          id: '101',
          city: "北京"
        }, {
          id: '102',
          city: "上海"
        }, {
          id: '103',
          city: "广州"
        }, {
          id: '104',
          city: "深圳"
        }]
      }
    }
  },
  {
    url: '/api/detail/:id',
    method: 'get',
    timeout: 1000,
    response: (req, res) => {
      const randomData = Mock.mock({
        title: '@ctitle(12,24)',
        price: '@float(89, 399, 2, 2)',
        desc: '@cparagraph(10,30)',
        tag: 'IFASHION',
        couponTip: '领券满299减30 · 登录查看更多',
        deliveryPromise: '预计3小时内发货 | 承诺48小时内发货',
        deliveryMeta: '河北保定 · 顺丰快递 · 免运费',
        images: [
          {
            url: '@image(300x150,@color,#fff,这)',
            alt: '@ctitle(5,10)'
          },
          {
            url: '@image(300x150,@color,#fff,是)',
            alt: '@ctitle(5,10)'
          },
          {
            url: '@image(300x150,@color,#fff,图)',
            alt: '@ctitle(5,10)'
          },
          {
            url: '@image(300x150,@color,#fff,片)',
            alt: '@ctitle(5,10)'
          },
          {
            url: '@image(300x150,@color,#fff,啊)',
            alt: '@ctitle(5,10)'
          },
        ]
      })
      return {
        code: 0,
        data: randomData
      }
    }
  },
  {
    // ?page=1 queryString
    url: '/api/images',
    method: 'get',
    timeout: 600,
    response: ({ query }) => {
      const page = Number(query.page) || 1;
      return {
        code: 0,
        data: getImages(page)
      }
    }
  },
  {
    url: '/api/discount/banners',
    method: 'get',
    timeout: 600,
    response: () => {
      return {
        code: 0,
        data: [
          {
            id: 'b-1',
            title: '五一错峰游',
            url: 'https://picsum.photos/seed/discount-banner-1/1200/520'
          },
          {
            id: 'b-2',
            title: '亲子出行季',
            url: 'https://picsum.photos/seed/discount-banner-2/1200/520'
          },
          {
            id: 'b-3',
            title: '海边度假专场',
            url: 'https://picsum.photos/seed/discount-banner-3/1200/520'
          }
        ]
      }
    }
  },
  {
    url: '/api/discount/list',
    method: 'get',
    timeout: 800,
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      return {
        code: 0,
        data: getDiscountList(page, pageSize)
      }
    }
  }
]