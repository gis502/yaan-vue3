<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-input
          v-model="requestParams"
          placeholder="请输入查询内容"
          clearable
          :prefix-icon="Search"
          class="search-input"
      />
      <el-button type="primary" class="button" @click="handleQuery()">搜索</el-button>
    </div>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Download" class="button" @click="dialogVisible = true">导出数据
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" class="button" @click="clearSelection()">清空选择</el-button>
      </el-col>
    </el-row>

    <el-table
        ref="multipleTableRef"
        :data="tableData"
        class="table"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" :reserve-selection="true"/>
      <el-table-column prop="id" label="序号" width="50" align="center"/>
      <el-table-column prop="earthquakeId" label="地震标识" width="200" align="center"/>
      <el-table-column prop="earthquake" label="震区" width="200" align="center"/>
      <el-table-column prop="aftershockCount" label="余震次数累计" align="center"/>
      <el-table-column prop="magnitude30To39" label="3.0-3.9级" align="center"/>
      <el-table-column prop="magnitude40To49" label="4.0-4.9级" align="center"/>
      <el-table-column prop="magnitude50To59" label="5.0-5.9级" align="center"/>
      <el-table-column prop="insertTime" label="统计时间" width="250" align="center" :formatter="dateFormatter"/>
    </el-table>
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
    />
    <el-dialog v-model="dialogVisible" title="选择需要导出的字段" width="50%">
      <el-transfer
          v-model="value"
          :props="{
      key: 'value',
      label: 'desc',
    }"
          :data="data"
          :titles="['可选字段', '已选字段']"
          filterable
          filter-placeholder="输入查询字段"
          :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}',
      }"
      >
        <template #right-footer>
          <el-button class="transfer-footer" type="primary" plain @click="dialogVisible = false">取消</el-button>
          <el-button class="transfer-footer" type="primary" plain @click="exportStatistics()">导出</el-button>
        </template>
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {ElMessage} from "element-plus";
import {exportExcel, getYaanAftershockStatistics} from "@/api/system/statistics.js";
import {Search} from "@element-plus/icons-vue";

const dialogVisible = ref(false)

const currentPage = ref(1)
const pageSize = ref(10)
const requestParams = ref("")

onMounted(() => {
  getList()
})

const tableData = ref([])
const total = ref()

/** 搜索按钮操作 */
function handleQuery() {
  currentPage.value = 1;
  getList();
}

// 请求数据
const getList = () => {
  getYaanAftershockStatistics({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    requestParams: requestParams.value
  }).then(res => {
    tableData.value = res.records
    total.value = res.total
  })
}

// 表格翻页选中（需要设置row-key）
function getRowKey(row) {
  return row.earthquakeId
}

// 分页函数
const handleSizeChange = (val) => {
  pageSize.value = val
  getList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getList()
}

const generateData = _ => {
  const data = []
  const names = ["统计截止时间", "地震标识", "震区", "余震次数累计", "3.0-3.9级", "4.0-4.9级", "5.0-5.9级"]
  const filed = ["insertTime", "earthquakeId", "earthquake", "aftershockCount", "magnitude30To39", "magnitude40To49", "magnitude50To59", "magnitude50To59"]
  for (let i = 0; i < names.length; i++) {
    data.push({
      value: filed[i],
      desc: names[i],
      disabled: false,
    })
  }
  return data
}

const data = ref(generateData())
let value = ref([])

const exportStatistics = () => {
  if (value.value.length < 1) {
    ElMessage({
      message: '请至少选择一个字段导出',
      type: 'error',
      plain: true,
    })
  } else {

    const ids = multipleSelection.value.map(item => item.id);

    exportExcel({
      fields: value.value,
      ids: ids
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'earthquake-data.xlsx');
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }).finally(() => {
      dialogVisible.value = false
    })
  }
}

const multipleTableRef = ref()
const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const clearSelection = () => {
  multipleTableRef.value?.clearSelection()
}

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const dateFormatter = (row, column, cellValue) => {
  return formatDate(cellValue);
}


</script>

<style lang="scss" scoped>
::v-deep .el-transfer-panel {
  width: 38%; /* 调整宽度 */
}

::v-deep .el-checkbox__label {
  font-size: 16px;
}

::v-deep .el-transfer {
  font-size: 16px;
}

::v-deep .el-input__inner {
  font-size: 16px;
}
</style>

