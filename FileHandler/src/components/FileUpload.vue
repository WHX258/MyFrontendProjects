<template>
  <div style="display:flex; padding:18px; border:1px; border-radius:8px; align-items:center; justify-content:center; flex-wrap:wrap; gap:16px;">
    <el-upload
        ref="uploader"
        drag
        :auto-upload="false"
        :limit="1"
        :on-change="handleChange"
        multiple
        style="flex:1; min-width:100px; width:100%;">

      <div class="el-upload__text" style="height:100%; display:flex; align-items:center; justify-content:center;">
        <font size="5">
          拖动文件到此 <br>或 <br>点击该虚线方块上传
        </font>
      </div>

      <template #tip>
        <div class="el-upload__tip">
          单次上传最大为100MB，一次上传一个文件

        </div>
      </template>
    </el-upload>

    <el-button type="success" :loading="uploading" @click="submitUpload">上传</el-button>
    <span style="margin-left:8px; color:#666;">{{status}}</span>

  </div>
</template>

<script>

export default {
  name: 'FileUpload',
  data() {
    return {
      file: null,
      uploading: false,
      status: ''
    };
  },
  methods: {

    handleChange(file) {
      this.file = file.raw || file;
    },
    async submitUpload() {
      if (!this.file) {
        this.status = '请先选择文件';
        return;
      }
      this.uploading = true;
      this.status = '上传中...';
      try {
        const fd = new FormData();
        fd.append('file', this.file);
        await this.$http.post('/files/upload', fd);

        this.$message.success('上传成功');
        this.$refs.uploader.clearFiles();
        this.file = null;
        this.$emit('uploaded');
        this.status = '上传成功';
        setTimeout(() => this.status = '', 1500);
      } catch (err) {
        console.error(err);
        this.$message.error('上传失败');
        this.status = '上传失败';
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>