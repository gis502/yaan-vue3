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
          <el-button size='large' type='primary' icon='el-icon-upload2' style="margin: 10px;">上传Excel文件
          </el-button>
          <el-button size='large' type='primary' icon='el-icon-download' style="margin: 10px;"
                     @click="downExcel($event)">下载Excel文件
          </el-button>
          <el-button size='large' type='primary' @click='downloadFile($event)' icon='el-icon-upload'>
            下载模板
          </el-button>

        </el-upload>
        <el-input
          v-model="inputValue"
          placeholder="请输入查询内容"
          clearable
          @keyup.enter.native=""
          @click.stopPropagation
          style="width: 302px; height: auto;margin-right: 10px;margin-left: 10px;"
        ></el-input>
        <el-button type="primary" @click="">
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
          添加数据：{{ addCount }} 更新数据：{{ updateCount }}
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
<!--        <div class="tableStyle">-->
<!--          <el-table-->
<!--            :data="this.tableData"-->
<!--            width="100%"-->
<!--            height="700"-->
<!--            ref="table"-->
<!--            fit-->
<!--            :disable="true"-->
<!--            class="data-table"-->
<!--            border-->
<!--            element-loading-text="Loading"-->
<!--            highlight-current-row-->
<!--            stripe-->
<!--            :row-style="{ height: '6.7vh' }"-->
<!--            :cell-style="{ padding: '0px', borderColor: '#C0C0C0' }"-->
<!--            :header-cell-style="{ borderColor: '#C0C0C0', background: 'rgba(252,218,5,0.22)' }"-->
<!--          >-->
<!--            <el-table-column-->
<!--              align='center'-->
<!--              prop='handleUserName'-->
<!--              label='用户'-->
<!--            ></el-table-column>-->
<!--            <el-table-column-->
<!--              align='center'-->
<!--              prop='handleUnit'-->
<!--              label='单位'-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              align='center'-->
<!--              prop='time'-->
<!--              label='更新时间'-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              align='center'-->
<!--              prop='message'-->
<!--              label='添加数据'-->
<!--              :formatter='formatMessageAdd'-->
<!--            >-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              align='center'-->
<!--              prop='message'-->
<!--              label='更新数据'-->
<!--              :formatter='formatMessageUpdate'-->
<!--            >-->
<!--            </el-table-column>-->
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
<!--          </el-table>-->
<!--          <upLoad v-if="isLoading"></upLoad>-->
<!--          <loadingMask v-if="isLoadingMask"></loadingMask>-->
<!--          <div class="paging-block">-->
<!--            <el-pagination-->
<!--              @size-change="handleSizeChange"-->
<!--              @current-change="handleCurrentChange"-->
<!--              :current-page="currentPage"-->
<!--              layout="total, sizes, prev, pager, next, jumper"-->
<!--              :total="totalCount"-->
<!--            ></el-pagination>-->
<!--          </div>-->

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
<!--        </div>-->
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


export default {
  name: "index",
  components:{loadingMask,upLoad},
  setup() {
    const userStore = useUserStore();
    const name = ref(userStore.name);
    const uploadUrl = ref(`http://localhost:8080/AfterShockStatistics/getAfterShockStatistics/${name.value}`);
    const websocket = ref(null);
    return{
      name:userStore.name,
      uploadUrl,
      websocket,
    }
  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken()
      },
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
      //后端通信接口
      // uploadUrl: "http://localhost:8080/AfterShockStatistics/getAfterShockStatistics/",
      // websocket: null,
    }
  },
  mounted() {
    console.log()
  },
  methods:{
    //随时间变化查询,用于日志查询
    getExcelUploadByTimeButton() {
      this.isLoadingMask = true
      getExcelUploadByTime({
        "time": this.timeValue
      }).then((res) => {
        this.tableData = res.data
        // 模拟添加成功和更新成功的计数
        let addSuccessCount = 0;
        let updateSuccessCount = 0;
        const addSuccessPattern = /添加成功/g;
        const updateSuccessPattern = /更新成功/g;
        if (res.data) {
          res.data.forEach((log) => {
            const matcherAdd = log.message.match(addSuccessPattern);
            const matcherUpdate = log.message.match(updateSuccessPattern);

            addSuccessCount += matcherAdd ? matcherAdd.length : 0;
            updateSuccessCount += matcherUpdate ? matcherUpdate.length : 0;
          });
        }

        // 将计数值保存到 this 对象中
        this.addCount = addSuccessCount;
        this.updateCount = updateSuccessCount;
        this.totalCount = res.data.length
        this.isLoadingMask = false
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
    // 下载模板文件
    downloadFile(event) {
      event.stopPropagation(); // 阻止事件传播
      let a = document.createElement('a')
      a.href = '/static/技术保障组工作表（模版1）.xlsx'
      a.download = '技术保障组工作表（模版1）.xlsx'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    // 上传时验证是否为Excel文件
    beforeAvatarUpload(file) {
      const type = file.name.split('.')[1]
      const isExcel = (type === "xlsx") || (type === 'xls');
      if (!isExcel) {
        this.$message({
          type: 'error',
          message: '附件格式错误，请重新上传！'
        })
      } else {
        this.isLoading = true
        if ('WebSocket' in window) {
          // 判断当前的浏览器是否支持WebSocket
          // 如果支持则创建一个WebSocket赋值给刚才创建的变量
          // 后面的路径实际上就是一次请求，但是这里用的是WebSocket协议
          // 记住这个地方后面详细讲到怎么写
          this.websocket = new WebSocketReconnect('ws://localhost:8080' + '/WebSocketServerExcel/'+ this.name)
        } else {  // 如果不兼容则弹框，该浏览器不支持
          alert('该浏览器不支持')
        }
        this.websocket.socket.onmessage = (event) => {
          if (Number.parseInt(event.data)) {
            this.percent = Number.parseInt(event.data)
          }
        }
      }
      this.uploadedFile = file;
      return isExcel;
    },

    // 上传成功弹窗展示上传结果,需修改
    handleSuccess(res, file, fileList) {

      // const account = res.data.失败信息.length + res.data.成功信息.length
      // if (res.data.失败信息[0] === "Excel格式错误-表头要求为-信息资产统计综合表") {
      //   this.$message({
      //     type: 'error',
      //     message: 'Excel格式错误-表头要求为-信息资产统计综合表',
      //   })
      // } else {
      //   this.isLoading = false
      //   // 获取Excel导入结果信息
      //   this.$alert("导入总数：" + account + " 成功数量：" + res.data.成功信息.length + " 失败数量：" + res.data.失败信息.length, '导入结果', {
      //     dangerouslyUseHTMLString: true,
      //     confirmButtonText: '确定',
      //     callback: action => {
      //       // this.searchData();
      //       this.getExcelUploadByTimeButton()
      //     }
      //   });
        setTimeout(() => {
          this.percent = 0
        }, 500)
        // 关闭websocket连接
        this.websocket.close()
        // 获取日志信息
        // this.searchData()
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
  height:100%;
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

</style>

