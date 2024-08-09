<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain  size="mini" @click="handleOpen('新增')">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="table-center">
      <el-table-column prop="modelName" label="模型名称" width="300" align="center"></el-table-column>
      <el-table-column prop="addTime" label="添加时间" align="center"></el-table-column>
      <el-table-column prop="modelPath" label="模型路径" align="center"></el-table-column>
      <el-table-column prop="modelHeight" label="模型高度" align="center"></el-table-column>
      <el-table-column prop="rotationAngle" label="旋转角度" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleOpen('修改',scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" width="30%" :show-close="false">
      <el-row :gutter="10">
        <el-col :span="6">模型名称：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.modelName" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">添加时间：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.addTime" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">模型路径：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.modelPath" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">模型高度：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.modelHeight" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">旋转角度：</el-col>
        <el-col :span="18">
          <el-input v-model="dialogContent.rotationAngle" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      tableData: [
        { eqid: 1, modelName: '7.37平方公里模型', addTime: '2023-08-19 15:31:19', modelPath: 1, modelHeight: -557, rotationAngle: 0},
        { eqid: 2, modelName: '0.4平方公里模型', addTime: '2023-07-23 17:19:09', modelPath: 2, modelHeight: -556 , rotationAngle: 0},
        { eqid: 3, modelName: 'model1', addTime: '2023-08-10 17:02:57', modelPath: '/model1', modelHeight: 0, rotationAngle: 0},
        { eqid: 4, modelName: 'model2', addTime: '2023-08-18 09:30:20', modelPath: '/model2', modelHeight: 0, rotationAngle: 0},
        { eqid: 5, modelName: 'model3', addTime: '2023-08-13 13:40:11', modelPath: '/model3', modelHeight: 0, rotationAngle: 0},
        { eqid: 6, modelName: 'model4', addTime: '2023-08-14 07:12:38', modelPath: '/model4', modelHeight: 0, rotationAngle: 0},
        // 继续添加更多静态数据...
      ],
      total: 6, // 根据静态数据的数量设置总数
      pageSize: 10,
      pageSizes: [5, 10, 20, 40],
      currentPage: 1,
      //--------------------------------------
      dialogShow: false,
      dialogTitle: null,
      dialogContent: {
        modelName: '',
        addTime: '',
        modelPath: '',
        modelHeight: '',
        rotationAngle: '',
        depth: '',
        eqid: ''
      },
    }
  },
  methods: {
    handleDelete(row) {
      this.tableData = this.tableData.filter(item => item.eqid !== row.eqid);
      this.total = this.tableData.length;
    },
    handleOpen(title, row) {
      if (title === "新增") {
        this.dialogTitle = title;
        this.dialogContent = {
          modelName: '',
          addTime: '',
          modelPath: '',
          modelHeight: '',
          rotationAngle: '',
          depth: '',
          eqid: ''
        };
      } else {
        this.dialogTitle = title;
        this.dialogContent = { ...row };
      }
      this.dialogShow = !this.dialogShow;
    },
    commit() {
      if (this.dialogTitle === "新增") {
        this.dialogContent.eqid = Date.now();
        this.tableData.push({ ...this.dialogContent });
      } else {
        const index = this.tableData.findIndex(item => item.eqid === this.dialogContent.eqid);
        if (index !== -1) {
          this.tableData.splice(index, 1, { ...this.dialogContent });
        }
      }
      this.total = this.tableData.length;
      this.dialogShow = false;
      this.clearDialogContent();
    },
    cancel() {
      this.dialogShow = false;
      this.clearDialogContent();
    },
    clearDialogContent() {
      Object.keys(this.dialogContent).forEach(key => {
        this.dialogContent[key] = '';
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableData = this.getPageArr();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableData = this.getPageArr();
    },
    getPageArr() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      return this.tableData.slice(start, end);
    },
  },
}
</script>

<style scoped>
/* 表格内容居中 */
.table-center .el-table__cell {
  text-align: center;
}

/* 分页框居中 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

