export default {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 75, // 以iPhone6为参考，1rem=37.5px
      propList: ['*'], // 所有属性都转换
      exclude: /node_modules/i, // 排除node_modules中的文件
    },
  }
}