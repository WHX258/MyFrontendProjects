Element-UI 笔记
# 简介
Element是国内饿了么公司提供的一套开源前端框架，简洁优雅，提供了Vue.
React、Angular等多个版本。因为3还在快速迭代，所以先学习Vue2版本的Element-UI。
文档地址: [官网](https://element.eleme.cn/#/zh-CN/)
安装: 进入项目根目录，执行`npm i element-ui`

# 使用
在main.js中引入
```javascript
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  el: '#app',
  render: h => h(App)
});
```
然后在组件中就可以直接使用Element提供的组件了，例如下面的表格：
```vue
<template>
  <el-table
      :data="tableData"
      style="width: 100%">
    <el-table-column
        prop="date"
        label="日期"
        width="180">
    </el-table-column>
    <el-table-column
        prop="name"
        label="姓名"
        width="180">
    </el-table-column>
    <el-table-column
        prop="address"
        label="地址">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>
```