# VueRouter简介
路由管理器用于构建**单页面应用**（SPA）。它允许开发者在不同的URL路径之间导航，同时保持应用的状态和组件的渲染。
`router3`对应`vue2.x`版本，`router4`对应`vue3.x`版本。
这里的demo会模拟一个`navigation`的功能，展示如何使用VueRouter来实现页面之间的导航。  
核心点： `routerlink和path的使用。`


# VueRouter安装
可以通过npm安装VueRouter 3.x：
```bash
npm install vue-router@3
```


# VueRouter使用
## 创建路由
依然需要在main.js中引入VueRouter，并创建一个路由实例：
```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
```
在vue router中，并不需要注册全部的组件，而是通过一个超链接`<router-link>`来实现页面之间的导航。
还有一个锚点，路由占位符`<router-view>`，它会根据当前的路由路径来渲染对应的组件。  
`对应关系会另起js文件说明。`  
当然这个js文件需要在main.js中引入，在Vue中使用。

例如`App.vue`：
```html
<template>
  <div>
    <h1>Vue Router Demo</h1>
    <nav>
      <router-link to="/discover">Discover</router-link>
      <router-link to="/my">My</router-link>
      <router-link to="/friends">Friend</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
```
`router/index.js`：
```javascript
import VueRouter from "vue-router";
import Vue from "vue";
import Discover from "../components/Discover.vue";
import My from "../components/My.vue";
import Friends from "../components/Friends.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    // 定义跳转规则
    routes: [
        {path: "/", redirect: "/discover"}, // 重定向功能，访问/会默认跳转到discover
        {path: "/discover", component: Discover},
        {path: "/my", component: My},
        {path: "/friends", component: Friends},
    ]
})

// 导出路由对象
export default router;
```
在main.js中引入路由：
```javascript
import Vue from 'vue'
import App from './App.vue'
import router from "./router/index";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 在Vue中定义一个router属性，并且它的值是我们之前创建的router对象。
  router: router
}).$mount('#app')
```

运行，就可以看到三个链接。

## 嵌套路由
可以套娃，在子路由下再定义路由。
例如Discover.vue：
```html
<template>
  <div>
    <h2>Discover Page</h2>
    <nav>
      <router-link to="/discover/recommend">Recommend</router-link>
      <router-link to="/discover/toplist">Top List</router-link>
    </nav>
<!-- 一定要加入锚点.... -->
    <router-view></router-view>
  </div>
</template>
```
继续在`router/index.js`中添加子路由：
```javascript
const router = new VueRouter({
  // 定义跳转规则
  routes: [
      {path: "/", redirect: "/discover"}, // 重定向功能，访问/会默认跳转到discover
      {path: "/discover", component: Discover,
      // 嵌套路由，定义children属性
        children: [
            {path: "hots", component: Hots},
            {path: "prefer", component: Prefer},
        ]
      },
      {path: "/my", component: My},
      {path: "/friends", component: Friends},
  ]
})
```
这样在Discover页面中就可以看到hots和prefer两个链接，点击后会在Discover页面的锚点处渲染对应的组件。

## 动态路由
当有一个列表，含有多个相似的页面，可以使用动态路由，让多个路径都对应同一组件，组件内部通过参数来区分不同的页面内容。  
例如`My.vue`：
```html
<template>
  <div>
    <h2>My</h2>
    <nav>
      <router-link to="/my/1">1</router-link>
      <router-link to="/my/2">2</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>
```
在`router/index.js`中添加动态路由：
```javascript
// ...
routes: [
    {path: "/", redirect: "/discover"}, // 重定向功能，访问/会默认跳转到discover
    {path: "/discover", component: Discover,
        // 嵌套路由，定义children属性
        children: [
            {path: "hots", component: Hots},
            {path: "prefer", component: Prefer},
        ]
    },
    {path: "/my", component: My,
        // 动态路由，多个路由共用一个组件
        children: [
            // :id是动态参数，可以在Music组件中通过$route.params.id来获取这个参数的值
            {path: ":id", component: Music} 
        ]
    },
    {path: "/friends", component: Friends},
]
//...
```
然后在`Music.vue`中通过`$route.params.id`来获取动态参数的值：
```html
<template>
  <div>
    <h3>Music {{ $route.params.id }}</h3>
  </div>
</template>
```
这样点击My页面中的1和2链接，就会在My页面的锚点处渲染Music组件，并且显示对应的id值。

还有另一种方式，使用props来传递参数：
```javascript
// ...
children: [
    // 开启props属性，可以传递参数
    {path: ":id", component: Music, props: true}
]
```
Music组件通过props来接收id参数：
```html
<template>
  <div>
    <h3>Music {{ id }}</h3>
  </div>
</template>
<script>
export default {
  props: ["id"] 
}
</script>
```