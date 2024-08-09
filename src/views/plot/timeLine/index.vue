<template>
  <div class="app-container">
    <el-table :data="tableData"
              @row-click="go"
              :stripe="true"
              :cell-style="tableColor"
    >
      <el-table-column prop="position" label="位置" width="300" header-align="center" align="left"></el-table-column>
      <el-table-column prop="time" label="发震时间" header-align="center" align="center"></el-table-column>
      <el-table-column prop="magnitude" label="震级" header-align="center" align="center"></el-table-column>
      <el-table-column prop="longitude" label="经度" header-align="center" align="center"></el-table-column>
      <el-table-column prop="latitude" label="纬度" header-align="center" align="center"></el-table-column>
      <el-table-column prop="depth" label="深度" header-align="center" align="center"></el-table-column>
    </el-table>


      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          style="display: flex; justify-content: center; margin-top: 20px;"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>


  </div>
</template>

<script>
import {getAllEq, deleteeq} from '@/api/system/eqlist'

export default {
  name: "timelineeqlist",
  data() {
    return {
      getEqData: [],
      tableData: [],
      total: 0,
      pageSize: 10,
      pageSizes: [5, 10, 20, 40],
      currentPage: 1,
      //--------------------------------------
      dialogShow: false,
      dialogTitle: null,
      dialogContent: {
        position: '',
        time: '',
        magnitude: '',
        longitude: '',
        latitude: '',
        depth: '',
        eqid: '',
        // istimeLine:'',
      },
    }
  },
  mounted() {
    this.getEq()
  },
  methods: {
    getEq() {
      let that = this
      getAllEq().then(res => {
        let data = []
        // console.log(res)
        for (let i = 0; i < res.length; i++) {
          let item = res[i]
          item.time = that.timestampToTime(res[i].time)
          data.push(item)
        }
        that.getEqData = data
        // console.log(that.getEqData)
        that.total = res.length
        that.tableData = that.getPageArr()
      })
    },
    timestampToTime(timestamp) {
      let DateObj = new Date(timestamp)
      // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
      let year = DateObj.getFullYear()
      let month = DateObj.getMonth() + 1
      let day = DateObj.getDate()
      let hh = DateObj.getHours()
      let mm = DateObj.getMinutes()
      let ss = DateObj.getSeconds()
      month = month > 9 ? month : '0' + month
      day = day > 9 ? day : '0' + day
      hh = hh > 9 ? hh : '0' + hh
      mm = mm > 9 ? mm : '0' + mm
      ss = ss > 9 ? ss : '0' + ss
      // return `${year}年${month}月${day}日${hh}时${mm}分${ss}秒`
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    },

    // 对数据库获取到的标绘图片数组切片
    getPageArr() {
      let arr = []
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      if (end > this.total) {
        end = this.total
      }
      for (; start < end; start++) {
        arr.push(this.getEqData[start])
      }
      return arr
    },
    //`每页 ${val} 条`
    handleSizeChange(val) {
      this.pageSize = val
      this.tableData = this.getPageArr()
      // console.log(`每页 ${val} 条`);
    },
    // `当前页: ${val}`
    handleCurrentChange(val) {
      this.currentPage = val
      this.tableData = this.getPageArr()
      // console.log(`当前页: ${val}`);
    },

    go(row, column, cell, event) {
      this.$router.push({name: 'thdTimeLine', params: {eqid: row.eqid}})
    },
    // 修改table header的背景色
    tableColor({row, column, rowIndex, columnIndex}) {
      // console.log(row.magnitude)
      if (row.magnitude > 5) {
        // console.log('>')
        return {
          // 'background-color': 'rgb(65,159,255)',
          'background-color': 'rgba(65,159,255,0.19)',
          'border-color': '#f8f8f9',
        }
      }
      else{
        return {
          'background-color': 'rgb(255,255,255)',
          'border-color': '#f8f8f9',
        }
      }
    },
  }
}
</script>

<style scoped>


</style>
