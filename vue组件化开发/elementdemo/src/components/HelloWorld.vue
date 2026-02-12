<template>
  <!--
  :data绑定表格数据
  el-table-column定义表格列
  prop是tableData的key
  label是显示给用户的文字
  width是列的宽度

  stripe属性使表格带有斑马纹
  border属性使表格有垂直边框
  :row-class-name为某一行添加 class，表明该行处于某种状态
  在方法里定义tableRowClassName，根据rowIndex返回不同的class名称
  函数中的row参数表示行数据，rowIndex表示行索引，比如可以使用row.name
  -->
  <el-table
      :data="tableData"
      stripe
      border
      :row-class-name="tableRowClassName"
      style="width: 100%">
    <el-table-column
        prop="date"
        label="日期"
        width="180">
    </el-table-column>
    <el-table-column
        prop="name"
        label="姓名"
        width="180">
    </el-table-column>
    <el-table-column
        prop="address"
        label="地址">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'warning-row';
      } else if (rowIndex === 2) {
        return 'success-row';
      }
      return '';
    }
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>