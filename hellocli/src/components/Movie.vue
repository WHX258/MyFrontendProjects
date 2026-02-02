<template>
  <div class="movie">
    <h1>{{ title }}</h1>
    <span>{{ rating }}</span>
    <button @click = "fun"> 收藏 </button>
  </div>
</template>

<script>
// 导出组件选项对象，对应了app.vue中的导入
export default {
  name: 'Movie', // movie组件的名称
  props: [ // 组件之间传值使用props，可以从父组件传值到子组件
    "id","title","rating"
  ],
  data() { // 组件自己的数据
    return {

    }
  },
  methods: {
    // 组件的方法，和vue基础操作是一样的
    fun(){
      alert("你收藏了"+this.title)
    }
  }
}
</script>