<template>
  <div class="container" style="max-width:1000px; margin:20px auto;">
    <el-card>
      <div slot="header">
        <span>文件解析与浏览</span>
      </div>

      <file-upload @uploaded="reloadList" @reload="reloadList"></file-upload>

      <div style="margin:16px 0"></div>

      <file-list
          :files="files"
          @delete-file="handleDelete"
          @parse-file="handleParse"
          @reload="reloadList">
      </file-list>

      <parse-dialog
          :visible.sync="parseDialogVisible"
          :file-name="parseFileName"
          :lines="parseLines">
      </parse-dialog>
    </el-card>
  </div>
</template>

<script>
import FileUpload from './components/FileUpload.vue';
import FileList from './components/FileList.vue';
import ParseDialog from './components/ParseDialog.vue';

export default {
  name: 'App',
  components: { FileUpload, FileList, ParseDialog },
  data() {
    return {
      files: [],
      parseDialogVisible: false,
      parseFileName: '',
      parseLines: []
    };
  },
  created() {
    this.reloadList();
  },
  methods: {
    async reloadList() {
      try {
        const res = await this.$http.get('/files/list');
        this.files = res.data;
      } catch (err) {
        console.error(err);
        // vue的弹窗消息：this.$message
        this.$message.error('无法加载文件列表');
        this.files = [];
      }
    },
    async handleDelete(fileName) {
      try {
        await this.$http.delete('/files/delete/' + encodeURIComponent(fileName));
        this.$message.success('删除成功');
        this.reloadList();
      } catch (err) {
        console.error(err);
        this.$message.error('删除失败');
      }
    },
    async handleParse(file) {
      try {
        // 下载为 blob，再提交到解析接口，与后端保持兼容
        const url = file.downloadUri || ('/files/download/' + encodeURIComponent(file.fileName));
        const resp = await this.$http.get(url, { responseType: 'blob' });
        const blob = resp.data;
        const f = new File([blob], file.fileName, { type: blob.type || 'application/octet-stream' });
        const fd = new FormData();
        fd.append('file', f);
        const parseResp = await this.$http.post('/files/parse', fd);
        const data = parseResp.data;

        if (data.error) {
          this.$message.error(data.error);
          return;
        }
        const paragraphs = Array.isArray(data.paragraphs) ? data.paragraphs : [];
        const lines = [];
        paragraphs.forEach(p => {
          const txt = (typeof p === 'string') ? p : JSON.stringify(p);
          txt.split(/\r?\n/).forEach(l => lines.push(l));
        });
        this.parseFileName = file.fileName;
        this.parseLines = lines;
        this.parseDialogVisible = true;
      } catch (err) {
        console.error(err);
        this.$message.error('解析失败');
      }
    }
  }
};
</script>