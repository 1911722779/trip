# react 旅游 APP

- 移动 App
- 模仿 App
  - 喜欢的、国外的
  - 有点改变、创新点
- 绝大多数的考点
  - 都适用于任何App 

## 技术栈
- React全家桶
  React组件开发
  组件的封装
  第三方组件库
  受控和非受控
  hooks编程 自定义的hooks 
  react-Router-DOM
    SPA
    路由守卫
    懒加载
  Zustand
- mock 接口模拟
- axios 请求拦截和代理
- jwt 登录
- module css
- vite 配置
- 性能优化
  防抖节流
  useCallback useMemo ......
- css 预处理器 styles
  flex布局 transition transform
- LLM
  - chat
  - 生图
  - 语音
  - coze 工作流 调用
  - 流式输出
- 移动端适配
  rem 
- 单例模式 设计模式的理解
- git 提交

## 项目的架构
- components
- pages
- store
- hooks
- api
- mock

## 开发前的准备
- 安装的包
  - react-router-dom zustand axios
  - react-vant(UI组件库) lib-flexible(解决移动端适配)
- 开发期间的依赖(上线时不需要的)
  - vite-plugin-mock jwt
  - postcss  postcss-pxtorem 用于换算rem
- vite配置
  - alias
  - mock
  - .env.local
  llm apiKey 
  - user-scalable=no
  - css 预处理
    index.css reset
    box-sizing 盒子模型 font-family:-apply-system
    App.css 全局通用样式
    module.css 模块化样式
  - 移动端的适配 rem 
    不能用px，用相对单位rem 针对html
    不同设备上要体验一致 
    不同尺寸手机 等比例缩放
      设计师设计稿 750px iPhone4 375pt *2 = 750
      小米 
      css 一行代码 手机不同尺寸 html的font-size 等比例缩放
    layout 
    flexible.js  
      阿里设计的 在任何设备上 1rem = 屏幕宽度/10
- lib-flexible
  阿里开源
  设置html fontSize = window.innerWidth /10
  css px 宽度 = 手机设备宽度 = 375
  1px = 2发光源
  750px 设计稿

- 设计稿上查看一个盒子的大小
  - 1像素不差的还原设计稿
  - 设计稿中像素单位
  - /75

## 项目亮点
- 移动端适配 
  - lib-flexible 1rem=屏幕宽度/10
  - 设计稿 尺寸是iPhone 标准尺寸 750px
  - 前端的职责是还原设计稿
  - 频繁的单位换算
  - 自动化？ 
    - postcss + postcss-pxtorem px换算rem
    - postcss 是css 预编译器，很强大
    - vite 会自动读取postcss.config.js 将css 内容编译 px -> rem
## git 提交规范
- 项目初始化
## 功能模块
- UI 组件库
  - react-vant 第三方组件库 70%的组件已经有了，不用写
  - 选择一个适合业务的UI组件库 或者公司内部的组件库 
- 配置路由及懒加载
  - 懒加载
  - 路由守卫
  - Layout 组件
    - 嵌套路由Outlet 进行分组路由配置
    - 网页有几个模板 Layout
      - Route 不加path 对应的路由自动选择
      - tabbar 模板
      - blank 模板
  - tabbar 导航标签
    - react-vant + @react-vant/icons
    - value + onChange 响应式
    - 直接点击链接分享 active 的设置
- chatbot 模块
  - llm模块 chat 封装
  - 迭代chat，支持任意模型 
- Search 模块
  - 防抖
  - api
    AjaxSuggest GoogleSuggest
  - localStorage
- toast 组件封装
  - 需要自定义，UI组件库不满足需求
  - UI props
  - JS 显示出来 跨层级通信
    观察者
  - mitt eventBus 事件总线 
    - 实例化 mitt()
    - .on(自定义事件的名字，callback)
    - emit(自定义事件的名字，参数)
    组件通过监听一个自定义事件，实现基于事件的组件通信
  
## 项目亮点和难点
- 前端智能
  - chat函数
  - 对各家模型进行调试 对chat重构，升级为qwen3.5-plus,kimi2等模型
    性能、能力、性价比综合考虑
    随意切换大模型，通过参数抽象
  - 文本生成图片
    - 优化prompt 设计
- 原子css
  - App.css 里面添加通用样式
  - 各自模块里有module.css 不影响别的组件
  - postcss pxtorem 插件 快速还原设计稿
  - 原子类的css
    一个元素按功能逻辑拆分成多个类，和原子一样
    元素的样式就可以由这些原子类组合而成
    样式基础 样式复用率高 以后几乎可以不用写样式
- 用户体验优化
  - 搜索建议，防抖+uesMemo 性能优化
  - 组件粒度划分
    React.memo + useCallback
  - 懒加载
  - 热门推荐 + 相关商品 （产品）
  - SPA Simple Page Application
  - 骨架屏 不用让用户等待了
  - 智能识别图片，围绕图片内容进行形成安排
    - 产品
      国内热门景点的旅程安排
    - 商业价值
      接入高德地图api 
      coze工作流 智能编排AI 流程
    - api调用
    - 插件
      图片里接插件 计算机视觉
      - 大模型 关键词
      prompt
  - workflow_id=7628544541594877979
  - token 

  - 设计工作流
    - 创建工作流 trip_pic
      上传景点图片（非必选）通过景点照片生成相关旅游路线
    - 代码节点
      参数校验和逻辑功能，返回运行的结果

## 项目遇到过什么问题，怎么解决的
- chat messages 遇到message 覆盖问题
- 闭包陷阱
  一次事件里面，两次setMessages()

- 自定义Hooks
  - useTitle
  一定要设置 

- es6 特性使用
  tabbar 的高亮跟随网址
  - arr.findIndex
  - str.startsIth
  - promise 

- 项目迭代
  - 功能由浅入深
  - chatbot qwen 简单chat
  - qwen-plus 推理模型 
  - 流式输出
  - 上下文 LRU
  - coze 工作流接口调用 

## 通用组件开发
- Loading 
  - 居中方案
    position:fixed + tlrb=0 + margin  auto
  - React.memo 无状态组件，不重新渲染
  - animation