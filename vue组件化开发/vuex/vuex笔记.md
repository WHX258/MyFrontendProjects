# 简介
vuex提供了`全局的状态管理器`，用于`组件之间的状态共享`。它采用`集中式存储管理`所有组件的状态。  
一般情况其实用不到，复杂的项目才需要使用vuex来管理状态，简单的项目可以直接使用组件之间的props和事件来进行通信。

## 状态管理
每一个vuex的核心是`store`。store状态变化时，与之绑定的视图就会变化。  
store中的状态不允许被直接修改，改变store中的状态的唯一途径是显式地提交(commit) mutation。
它包含了`state`、`getters`、`mutations`、`actions`和`modules`等属性。
![img.png](状态图.png)

## state
state是一个对象，`包含了应用的数据`。外部组件可以通过`this.$store.state.xxx`来访问state中的数据。  
于是每个组件都可以访问到store中的数据了。
## mutations
mutations包含了多个`用于更改state中的数据的方法`。
外部组件通过`this.$store.commit('mutationName')`来调用mutations中的方法，提交mutation，更新state，更新视图。
## getters
getters对state中的数据进行加工处理。
外部组件通过`this.$store.getters.xxx`来访问getters中的属性。
## actions
actions包含了多个方法，这些方法用于处理`异步`操作。actions中的方法可以调用mutations来更改state中的数据。
外部组件通过`this.$store.dispatch('actionName')`来调用actions中的方法，触发action，更新state，更新视图。


# 安装
vue2对应vuex3，vue3对应vuex4。
```bash
npm install vuex@3
```

# 使用

**`普遍来说，首先在store模块中定义各个store对象，然后在组件中使用计算属性来访问store中的数据，就可以在div块里使用了。`**

1. 建立`store`文件夹用于管理状态，建立`index.js`，`use(VueX)`，然后创建`store实例`，`export store`。  
在store实例中，可以定义state、modules`属性`，mutations、getters、actions中包含的`方法`。

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    todos: [ // 用于展示getters
      { id: 1, text: '第一项', done: true },
      { id: 2, text: '第二项', done: false }
    ]
  },

  mutations: {
    increment(state, n) {
      state.count += n
    }
  },

  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  actions: {
    // context是一个与store实例具有相同方法和属性的对象，可以通过context.commit来提交mutation，context.state来访问state中的数据。
    incrementAsync(context, n) {
      context.commit('increment', n)
    }
  },
  modules: {
    // 可能有多个store，每个模块都有自己的state、mutations、getters、actions，最后合并成一个store
  }
})
export default store

```

2. 在`main.js`中引入store，并挂载到vue实例上。
`main.js`
```js
import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  // 在vue上挂store
  store: store,
  render: h => h(App)
}).$mount('#app')
```

3. 在组件中使用store中的数据和方法。

这有两种方式：
* 可以直接在`div`中使用`{{this.$store.state.count}}`来访问state中的数据，
* 或 使用`计算属性`来访问state中的数据，这样`div`中就不需要每次都通过`this.$store.state`来访问了，可以简写为计算属性的名字。  
比如下面的`count`
  * 计算属性部分也可以进一步使用`mapState`简化，快速将store.state的属性 映射到 组件的计算属性中。

对于`getters`也可以使用`mapGetters`来简化，快速把getter方法返回的属性映射到计算属性中。  
对于`action和mutation`也可以在`method`中使用`mapActions`和`mapMutations`来简化，把store中的方法映射到组件的方法中，直接用`this.方法名()`来调用。

```vue
<template>
  <div class="hello">
    <!--    <h1>{{ this.$store.state.count }}</h1>-->
    <!--    或者更简洁只写count，用计算属性-->
    <h1>{{ count }}</h1>
    <button @click="addAsync">+2</button>

    <h2>Todo List:</h2>
    <ul>
      <!--      从getter方法中获取数据-->
      <li v-for="todo in doneTodos" :key="todo.id">{{ todo.text }}</li>
    </ul>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

  export default {
    name: 'HelloWorld',
    // 计算属性: 根据state计算新数据
    // computed: {
    // 这里count()方法的返回值就是计算属性count的值了，组件中就可以直接使用count来访问这个值了。
    // 方法名对应计算属性的名字。
    //   count() {
    //     return this.$store.state.count
    //   }
    // },

    // mapState： 将store中的state映射到组件的计算属性中
    // computed:mapState({
    //   count: state => state.count // 箭头函数
    // //   这里count是组件中的计算属性的名字
    // }),

    //   或者更简单只写 'count'，如
    // computed: mapState(['count',"todos"]),

    computed: {...mapState(['count', "todos"]), ...mapGetters(['doneTodos']), },
    // ...是展开函数，mapState和mapGetters返回的都是一个对象，computed又只接受一个对象
    // 所以用展开函数先把对象展开成方法，然后再把它们合并成一个对象

    // 如果想不用展开函数，可以直接在computed对象中写多个计算属性，如
    // computed: {
    //   count() {
    //     return this.$store.state.count
    //   },
    //   todos() {
    //     return this.$store.state.todos
    //   },
    //   doneTodos() {
    //     return this.$store.getters.doneTodos
    //   }
    // }

    methods: {
      ...mapMutations(['increment']), // 这里也可以用map映射来简写，将store中的mutations映射到组件的方法中，方法就可以用this.increment()来调用这个方法了
      ...mapActions(['incrementAsync']),
      add() {
        // this.$store.commit('increment', 2) // payload表示提交mutation时携带的额外信息。在这个例子中，payload是数字2，表示要增加的数量。
        this.increment(2)
      },
      addAsync() {
        // this.$store.dispatch('incrementAsync', 2)
        this.incrementAsync(2)
      }
    }
  }
</script>
```

