<template>
  <div style="max-width:1000px; margin:20px auto;">
    <el-card>
      <!--slot插槽-->
      <div slot="header">
        <span>文件解析与浏览</span>
      </div>
      <!--
      加载子组件file-upload，
      监听子组件file-upload中触发的uploaded事件，当事件触发时调用reloadList方法重新加载文件列表
      -->
      <file-upload @uploaded="reloadList"></file-upload>
      <!--
      加载子组件file-list，并监听delete-file、parse-file、reload事件
      通过 :files 传递给子组件files
      -->
      <file-list
          :files="files"
          @delete-file="handleDelete"
          @parse-file="handleParse"
          @reload="reloadList">
      </file-list>
      <!--
      加载子组件parse-dialog，
      并通过 :visible.sync="parseDialogVisible" 进行 文件名和解析结果 的双向绑定
      和v-model的区别在于，v-model默认绑定的是value属性和input事件，而这里我们需要绑定visible属性和visible-change事件，
      不是value和input事件，所以需要使用.sync修饰符来实现双向绑定。
      -->
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
      // 文件列表，初始为空，后续通过reloadList函数加载后端数据
      files: [],
      parseDialogVisible: false,
      parseFileName: '',
      parseLines: []
    };
  },
  // created函数在组件实例被创建后立即调用（网页打开或刷新），即，加载文件列表
  created() {
    this.reloadList();
  },
  methods: {
    // 异步
    async reloadList() {
      try {
        const res = await this.$http.get('/files/list');
        this.files = res.data;
      } catch (err) {
        console.error(err);
        // this.$message是vue的弹窗消息，示例：https://blog.csdn.net/PlasticsShaT/article/details/110632191
        this.$message.error('无法加载文件列表');
        this.files = [];
      }
    },
    // fileName从子组件file-list传递过来
    async handleDelete(fileName) {
      try {
        // encodeURIComponent对URI的特殊字符编码，确保文件名中的特殊字符不会导致请求错误
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
        // 后端解析接口会返回paragraphs字段，这里ide标黄没事。
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