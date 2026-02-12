import VueRouter from "vue-router";
import Vue from "vue";
import Discover from "../components/Discover.vue";
import My from "../components/My.vue";
import Friends from "../components/Friends.vue";
import Hots from "../components/Hots.vue";
import Prefer from "../components/Prefer.vue";
import Music from "../components/Music.vue";

Vue.use(VueRouter);

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
      {path: "/my", component: My,
          // 动态路由，多个路由共用一个组件
          children: [
              {path: ":id", component: Music, props: true},
          ]
      },
      {path: "/friends", component: Friends},
  ]
})

// 导出路由对象
export default router;