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
      <el-col :span="1.5">
        <el-select
            v-model="flag"
            placeholder="Select"
            size="large"
            style="width: 240px"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
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
      <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :align="col.align"
          :width="col.width"
      />
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
import {exportExcel, getField, getYaanCasualties} from "@/api/system/statistics.js";
import {Search} from "@element-plus/icons-vue";

const dialogVisible = ref(false)
const flag = ref()
const currentPage = ref(1)
const pageSize = ref(10)
const requestParams = ref("")

onMounted(() => {
  getTableField()
  //getYaanCasualtiesList()
})
const options = ref([]);
const tableData = ref([])
const field = ref([])
const files = ref([])//存储当前用户的导表信息
const name = ref([])
const columns = ref([]); // 用于存储表格列配置
const total = ref()
/** 监听 */
watch(flag, (newFlag) => {
  const selectedFile = files.value.find(file => file.fileId === newFlag);
  if (selectedFile && selectedFile.fileColumn) {
    const fileColumn = JSON.parse(selectedFile.fileColumn);
    const map = new Map(Object.entries(fileColumn));
    field.value = Array.from(map.keys());
    name.value = Array.from(map.values());
    data.value = generateData();
    columns.value = generateColumnConfig();
  }
  // 清空选择
  clearSelection();
  value.value = [];
  console.log("flag变化了打印files:", files.value, flag.value)
  getYaanCasualtiesList();

});

/** 搜索按钮操作 */
function handleQuery() {
  currentPage.value = 1;
  getYaanCasualtiesList()
}

// 请求数据
const getYaanCasualtiesList = async () => {
 await getYaanCasualties({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    requestParams: requestParams.value,
    flag: flag.value
  }).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
    console.log("请求数据:", tableData.value)
  })

}
const generateColumnConfig = () => {
  return field.value.map((fieldName, index) => ({
    prop: fieldName,
    label: name.value[index],
    align: "center",
    width: index < 2 ? "200" : undefined // Example: setting width for the first two columns
  }));
};
const generateFieldData = () => {
  return field.value.map((fieldName, index) => ({
    value: fieldName,    // `value` should match field identifier
    desc: name.value[index], // `desc` should match field description
    disabled: false     // Optional: define if the item is selectable
  }));
};

/** 获取字段 */
const getTableField = () => {
  getField().then(res => {
    files.value = res.data
    if (files.value.length ==0) {
      ElMessage.error("改用户无导表权限")
    }

    options.value = files.value.map(file => ({
      label: file.fileName,
      value: file.fileId
    }));

    flag.value = files.value[0].fileId; // 默认选择第一个表
    const fileColumn = JSON.parse(files.value[0].fileColumn);
    const map = new Map(Object.entries(fileColumn));
    field.value = Array.from(map.keys())
    name.value = Array.from(map.values())
    data.value = generateData();
    columns.value = generateColumnConfig();
    console.log("表格字段:", columns.value)

  })
}

// 表格翻页选中（需要设置row-key）
function getRowKey(row) {
  return row.id
}

// 分页函数
const handleSizeChange = (val) => {
  pageSize.value = val
  getYaanCasualtiesList()
}

const handleCurrentChange = async (val) => {
  currentPage.value = val
  await getYaanCasualtiesList()
  console.log("当前页数据", tableData.value)
}

const generateData = _ => {
  const data = [];
  // 确保 field 和 name 数组已经填充
  for (let i = 0; i < field.value.length; i++) {
    data.push({
      value: field.value[i],
      desc: name.value[i],
      disabled: false
    });
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
      ids: ids,
      flag: flag.value
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

