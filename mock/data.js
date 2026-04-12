import Mock from 'mockjs';

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
    url:'/api/detail/:id',
    method:'get',
    timeout:1000,
    response:(req,res)=>{
      const randomData = Mock.mock({
        title:'@ctitle(12,24)',
        price:'@float(89, 399, 2, 2)',
        desc:'@cparagraph(10,30)',
        tag:'IFASHION',
        couponTip:'领券满299减30 · 登录查看更多',
        deliveryPromise:'预计3小时内发货 | 承诺48小时内发货',
        deliveryMeta:'河北保定 · 顺丰快递 · 免运费',
        images:[
          {
            url:'@image(300x150,@color,#fff,这)',
            alt:'@ctitle(5,10)'
          },
          {
            url:'@image(300x150,@color,#fff,是)',
            alt:'@ctitle(5,10)'
          },
          {
            url:'@image(300x150,@color,#fff,图)',
            alt:'@ctitle(5,10)'
          },
          {
            url:'@image(300x150,@color,#fff,片)',
            alt:'@ctitle(5,10)'
          },
          {
            url:'@image(300x150,@color,#fff,啊)',
            alt:'@ctitle(5,10)'
          },
        ]
      })
      return {
        code:0,
        data:randomData
      }
    }
  }
]