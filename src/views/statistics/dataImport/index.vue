<template>
  <div class="contentsBox">
    <div class="dataBox">
      <div class="dataManage" style="height: auto">
        <el-upload
            name="file"
            class="upload-demo"
            :action="uploadUrl"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="this.headers">
          <el-button size='large' type='primary' style="margin: 10px;" plain icon="Upload">上传Excel文件
          </el-button>
        </el-upload>
        <el-button size='large' type='primary' style="margin: 10px;"
                   @click="downExcel($event)" plain icon="Download">下载上传Excel文件
        </el-button>
        <el-button size='large' type='primary' @click="downloadForm" plain icon="Document">
          下载模板
        </el-button>

        <el-dialog title="请选择表名"
                   v-model="formDialogVisible"
                   width="50%"
                   center>
          <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="表名" prop="tableName">
              <el-select v-model="form.tableName" placeholder="请选择表名" style="width: 18vw">
                <el-option
                    v-for="item in tableNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button @click="formDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="downloadFile($event)">确定</el-button>
          </div>

        </el-dialog>

        <el-input
            v-model="inputValue"
            placeholder="请输入查询内容"
            clearable
            @keyup.enter.native="searchDataButton($event)"
            @click.stopPropagation
            style="width: 250px; height: auto;margin-right: 10px;margin-left: 10px;"
        ></el-input>
        <el-button type="primary" @click="searchDataButton($event)" style="">
          <i class="el-icon-search" style="margin-right: 5px;"></i>搜索
        </el-button>
        <div style="margin-left: 1vw; font-size: 20px">
          <el-select v-model="timeValue" placeholder="今日" style="width: 7vw" @change="getExcelUploadByTimeButton">
            <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
          添加数据：{{ addCount }}

          <!--          更新数据：{{ updateCount }}-->
        </div>
      </div>
      <div class="dataContainer">
        <div class="grid-content">
          <el-progress
              :text-color="progressColor"
              :percentage='percent'
              :text-inside='true'
              :stroke-width='20'
          ></el-progress>
        </div>
        <div class="tableStyle">
          <el-table
              :data="this.tableData"
              width="100%"
              height="700"
              ref="table"
              fit
              :disable="true"
              class="data-table"
              border
              element-loading-text="Loading"
              highlight-current-row
              stripe
              :row-style="{ height: '6.7vh' }"
              :cell-style="{ padding: '0px', borderColor: '#C0C0C0' }"
              :header-cell-style="{ borderColor: '#C0C0C0', background: 'rgba(252,218,5,0.22)' }"
          >
            <el-table-column
                align='center'
                prop='operName'
                label='用户'
            ></el-table-column>
            <el-table-column
                align='center'
                prop='phonenumber'
                label='联系电话'
            ></el-table-column>
            <el-table-column
                align='center'
                prop='deptName'
                label='单位'
            >
            </el-table-column>
            <el-table-column
                align='center'
                prop='operTime'
                label='更新时间'
            >
            </el-table-column>
            <el-table-column
                align='center'
                prop='jsonResult'
                label='添加数据'
                :formatter='formatMessageAdd'
            >
            </el-table-column>
            <el-table-column
                align='center'
                prop='jsonResult'
                label='结果'
                :formatter='formatMessageUpdate'
            >
            </el-table-column>
            <!--            <el-table-column-->
            <!--              label='操作'-->
            <!--              align='center'-->
            <!--            >-->
            <!--              <template v-slot="scope">-->
            <!--                <el-button-->
            <!--                  size="mini"-->
            <!--                  type="success"-->
            <!--                  @click="getDetail(scope.row.message)"-->
            <!--                >详情-->
            <!--                </el-button-->
            <!--                >-->
            <!--              </template>-->
            <!--            </el-table-column>-->
          </el-table>
          <div class="paging-block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
            ></el-pagination>
          </div>

          <!--          <el-dialog-->
          <!--            title="详情"-->
          <!--            :visible.sync="dialogVisible"-->
          <!--            width="50%">-->
          <!--            <el-table-->
          <!--              :data="messageData"-->
          <!--              style="width: 100%"-->
          <!--              height="400"-->
          <!--              ref="table"-->
          <!--            >-->
          <!--              <el-table-column-->
          <!--                prop="id"-->
          <!--                label="编号"-->
          <!--                align='center'>-->
          <!--              </el-table-column>-->
          <!--              <el-table-column-->
          <!--                prop="message"-->
          <!--                label="信息"-->
          <!--                align='center'>-->
          <!--              </el-table-column>-->
          <!--              <el-table-column-->
          <!--                prop="isSuccess"-->
          <!--                align='center'-->
          <!--                label="是否成功">-->
          <!--              </el-table-column>-->
          <!--            </el-table>-->
          <!--            <span slot="footer" class="dialog-footer">-->
          <!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
          <!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
          <!--  </span>-->
          <!--          </el-dialog>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import upLoad from "@/components/LoadingMask/upLoad.vue";
import loadingMask from "@/components/LoadingMask/index.vue";
import WebSocketReconnect from "@/api/websocket";
import {getToken} from "@/utils/auth";
import useUserStore from "@/store/modules/user.js";
import {getExcelUploadByTime, getField} from "@/api/system/excel.js";
import {ElMessage} from "element-plus";


export default {
  name: "index",
  components: {loadingMask, upLoad},
  setup() {
    const userStore = useUserStore();
    const name = ref(userStore.name);
    const filename = ref('');
    const uploadUrl = ref(``);
    const websocket = ref(null);
    const formDialogVisible = ref(false)
    return {
      name,
      uploadUrl,
      filename,
      websocket,
      formDialogVisible
    }
  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken()
      },
      form: {
        tableName: ''
      },
      files: [],//导表文件列表
      tableNameOptions: [],
      timeOptions: [
        {
          value: '今日',
        }, {
          value: '近七天'
        }, {
          value: '近一个月'
        }, {
          value: '近三个月'
        }, {
          value: '近一年'
        }
      ],
      fileList: [],
      tableData: [],
      messageData: [],
      percent: 0,
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      progressColor: '#001ce1',
      inputValue: '',
      inputValueParams: '',
      addCount: 0,
      timeValue: '今日',
      updateCount: 0,
      totalCount: 0,
      isLoading: false,
      isLoadingMask: false,
      uploadedFile: null,
    }
  },
  mounted() {
    this.getTableName()
    this.getExcelUploadByTimeButton()
  },
  methods: {
    searchDataButton(event) {
      event.stopPropagation(); // 阻止事件传播
      this.inputValueParams = this.inputValue.trim()
      this.currentPage = 1
      this.getExcelUploadByTimeButton()
    },

    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    //添加数据数量
    formatMessageAdd(row, column, cellValue) {

      if (JSON.parse(cellValue).msg === "操作成功") {
        console.log("length:", JSON.parse(cellValue).data.length)
        const length = JSON.parse(cellValue).data.length;
        return length;
      } else {
        return 0;
      }
    },
    //更新数据数量
    formatMessageUpdate(row, column, cellValue) {
      // console.log("formatMessageUpdate:",JSON.parse(cellValue))
      if (JSON.parse(cellValue).msg === "操作成功") {
        return JSON.parse(cellValue).msg;
      } else {
        return "操作失败";
      }
    },
    //随时间变化查询,用于日志查询
    getExcelUploadByTimeButton() {
      getExcelUploadByTime({
        "time": this.timeValue,
        "requestParams":this.inputValueParams
      }).then((res) => {
        this.tableData = res.data
        this.addCount = res.data.reduce((total, log) => {
          const data = JSON.parse(log.jsonResult);
          if (data.msg === "操作成功") {
            return total + data.data.length;
          }
          return total;
        }, 0);

      })
    },
    // 下载上传的Excel
    downExcel(event) {
      event.stopPropagation(); // 阻止事件传播
      if (this.uploadedFile) {
        // 创建一个 URL 对象，用于将文件提供给用户下载
        const url = URL.createObjectURL(this.uploadedFile);
        // 创建一个新的 <a> 元素，设置其 href 属性为文件的 URL，并模拟点击
        const link = document.createElement('a');
        link.href = url;
        link.download = this.uploadedFile.name;
        link.click();
        // 释放 URL 对象
        URL.revokeObjectURL(url);
      } else {
        // 如果没有上传文件，则提示用户上传文件
        this.$message({
          type: 'error',
          message: '请先上传 Excel 文件！'
        });
      }
    },
    //显示表单
    downloadForm() {
      this.formDialogVisible = true
    },
    //查询user对应上的表
    getTableName() {
      getField().then(res => {
        console.log(res.data)
        this.files = res.data
        if (res.data === null) {
          ElMessage.error("该用户无导表权限")
        }
        //
        this.tableNameOptions = this.files.map(file => ({
          label: file.fileName,
          value: file.fileName
        }));
        this.form.tableName = this.tableNameOptions[0].label
      })
    },
    checkFileExists(filePath, callback) {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', filePath, true);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          // 文件存在
          callback(true);
        } else {
          // 文件不存在
          callback(false);
        }
      };
      xhr.onerror = function () {
        // 网络错误
        callback(false);
      };
      xhr.send();
    },
    downloadFile(event) {
      event.stopPropagation(); // 阻止事件传播

      // 获取表单提交的值
      const tableName = this.form.tableName;

      // 假设所有的文件都存储在 `static` 文件夹中，并且文件名格式为 "表单名称.xlsx"
      const fileName = `${tableName}.xlsx`;

      // 生成文件的完整路径
      const filePath = `/static/${fileName}`;

      this.checkFileExists(filePath, (exists) => {
        if (exists) {
          // 文件存在，创建一个 <a> 元素，设置其 href 属性为文件的路径，并模拟点击下载
          let a = document.createElement('a');
          a.href = filePath;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          // 文件不存在，显示提示
          this.$message({
            type: 'error',
            message: '文件不存在，请检查文件名或联系管理员！'
          });
        }
        this.formDialogVisible = false; // 关闭对话框
      });
    },
    // 上传时验证是否为Excel文件
    beforeAvatarUpload(file) {
      // 从对象数组中提取表名
      const validTableNames = this.tableNameOptions.map(option => option.label);
      const type = file.name.split('.')[1]
      // 获取不带扩展名的文件名
      const fileNameWithoutExtension = file.name.slice(0, -(type.length + 1));
      this.filename = fileNameWithoutExtension
      this.uploadUrl = `http://localhost:8080/excel/importExcel/${this.name}&${this.filename}`;
      const isExcel = (type === "xlsx") || (type === 'xls');
      if (!isExcel) {
        this.$message({
          type: 'error',
          message: '附件格式错误，请重新上传！'
        })
      }
      console.log(this.tableNameOptions)
      if (!validTableNames.includes(fileNameWithoutExtension)) {
        // 检查文件名是否在允许的表名列表中
        this.$message({
          type: 'error',
          message: '上传文件名称错误，请重新上传！'
        });
        return false;
      } else {
        this.isLoading = true
        if ('WebSocket' in window) {
          // 判断当前的浏览器是否支持WebSocket
          // 如果支持则创建一个WebSocket赋值给刚才创建的变量
          // 后面的路径实际上就是一次请求，但是这里用的是WebSocket协议
          // 记住这个地方后面详细讲到怎么写
          this.websocket = new WebSocketReconnect('ws://localhost:8080' + '/WebSocketServerExcel/' + this.name)
        } else {  // 如果不兼容则弹框，该浏览器不支持
          alert('该浏览器不支持')
        }
        this.websocket.socket.onmessage = (event) => {
          console.log(event.data)
          if (Number.parseInt(event.data)) {
            this.percent = Number.parseInt(event.data)
            console.log(this.percent)
          }
        }
      }
      this.uploadedFile = file;
      return isExcel;
    },

    // 上传成功弹窗展示上传结果,需修改
    handleSuccess(res, file, fileList) {
      const account = res.data.length
      // const account = res.data.失败信息.length + res.data.成功信息.length
      // if (res.data.失败信息[0] === "Excel格式错误-表头要求为-信息资产统计综合表") {
      //   this.$message({
      //     type: 'error',
      //     message: 'Excel格式错误-表头要求为-信息资产统计综合表',
      //   })
      // } else {
      this.isLoading = false
      // 获取Excel导入结果信息
      this.$alert("导入总数：" + account + " 成功数量：" + res.data.length, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        callback: action => {
          this.getExcelUploadByTimeButton()
        }
      });
      setTimeout(() => {
        this.percent = 0
        this.websocket.close()
      }, 500)
      // 关闭websocket连接
    }
  },

}
</script>

<style scoped>
.grid-content {
  padding: 9px;
  min-height: 36px;
  background-color: #b7c8da;
}


.contentsBox {
  margin: 10px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.54);
  height: 100%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.91);
}


.dataBox {
  max-height: 100vh;
  background-color: rgba(255, 255, 255, 0.73);
}

.dataManage {
  height: 50px;
  line-height: 50px;
  background-color: #bfcbd9;
  align-items: center;
  display: flex;
}

.dataContainer {
  max-height: 100vh;
  background-color: #ffffff;
  max-width: 100%;
  border-radius: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: left;
  gap: 10px; /* 按钮间距 */
  margin-top: 20px; /* 调整顶部外边距以保持对话框内容的间距 */
  margin-left: 100px;
}

/*table样式*/
/*.tableStyle{*/
/*  min-height: calc(100vh - 196px - 50px);*/
/*  max-height: calc(100vh - 196px - 50px);*/
/*  position: relative;*/
/*  max-width: 100%;*/
/*}*/


</style>

