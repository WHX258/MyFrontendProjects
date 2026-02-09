<template>
  <el-dialog :visible.sync="localVisible" :title="'解析结果：' + (fileName || '')" width="95%">
<!--无结果-->
    <div v-if="!lines || lines.length===0">
      <p style="color:#888">未提取到任何文本</p>
    </div>
    <el-table v-else :data="lines.map((t,i)=>({i:i+1,text:t}))" style="width:100%">
      <el-table-column prop="text">
        <template slot-scope="scope">
          <pre style="white-space:pre-wrap; margin:0;">{{ scope.row.text }}</pre>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="localVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ParseDialog',
  model: { prop: 'visible', event: 'update:visible' },
  props: {
    visible: Boolean,
    fileName: String,
    lines: { type: Array, default: () => [] }
  },
  data() {
    return { localVisible: this.visible };
  },
// Vue 的 侦听器，把父组件传下来的 parseDialogVisible 和组件内部的 localVisible 状态做同步，实现“属性下传、事件上报”的模式：
// 第一行，当父组件改变 visible（比如打开/关闭对话框）时，把新值写入内部的 localVisible，以驱动视图。
// 第二行，localVisible 变为 false（例如用户点击关闭）时，向父组件发出 update:visible 事件，通知父组件把 visible 设为 false（配合v-model）。注意这里只在变为 false 时发出，没有在变为 true 时回传。
  watch: {
    visible(v) { this.localVisible = v; },
    localVisible(v) { if (!v) this.$emit('update:visible', false); }
  }
};
</script>