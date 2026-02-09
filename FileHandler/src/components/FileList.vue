<template>
  <div>
    <el-table v-if="files && files.length" :data="files" stripe style="width:100%">
      <el-table-column prop="fileName" label="文件名"></el-table-column>
      <el-table-column label="大小 (MB)" width="140">
        <template slot-scope="scope">{{ formatMB(scope.row.size) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="320">
        <template slot-scope="scope">
          <el-button :href="downloadUri(scope.row)" type="primary" size="mini" target="_blank">下载</el-button>
          <el-button size="mini" @click="$emit('parse-file', scope.row)">解析</el-button>
          <el-button size="mini" @click="viewFile(scope.row)">浏览</el-button>
          <el-popconfirm
              title="确认删除？"
              confirm-button-text="删除"
              cancel-button-text="取消"
              @confirm="$emit('delete-file', scope.row.fileName)">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div v-else style="text-align:center; padding:18px; color:#999">暂无文件</div>
  </div>
</template>

<script>

export default {
  name: 'FileList',
  props: ['files'],
  methods: {
    formatMB(bytes) {
      if (typeof bytes !== 'number' || bytes <= 0) return '0.00 MB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },
    downloadUri(row) {
      return row.downloadUri || ('/files/download/' + encodeURIComponent(row.fileName));
    },
    viewFile(row) {
      const url = 'http://localhost:8081/files/view/' + encodeURIComponent(row.fileName);
      window.open(url, '_blank');
    }
  }
};
</script>