<template>
  <el-dialog :visible.sync="localVisible" :title="'解析结果：' + (fileName || '')" width="95%">
    <div v-if="!lines || lines.length===0">
      <p style="color:#888">未提取到任何文本</p>
    </div>
    <el-table v-else :data="lines.map((t,i)=>({i:i+1,text:t}))" :show-header="false" style="width:100%">
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
  props: {
    visible: Boolean,
    fileName: String,
    lines: { type: Array, default: () => [] }
  },
  data() {
    return { localVisible: this.visible };
  },
  watch: {
    visible(v) { this.localVisible = v; },
    localVisible(v) { if (!v) this.$emit('update:visible', false); }
  }
};
</script>