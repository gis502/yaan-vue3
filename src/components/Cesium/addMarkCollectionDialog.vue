<template>
  <el-dialog class="dialogDiv" v-model="DialogFormVisible" title="添加标注信息" width="800"
             :close-on-click-modal="false" :destroy-on-close="true" :show-close="false">
    <el-form :model="this.form" :inline="true">
      <el-form-item label="标注类型" :label-width="100">
        <el-input placeholder="请输入内容" v-model="form.type" :disabled="true" size="large"/>
      </el-form-item>
      <el-form-item label="经度" :label-width="100">
        <el-input v-model="form.lon" autocomplete="off" size="large"/>
      </el-form-item>
      <el-form-item label="纬度" :label-width="100">
        <el-input v-model="form.lat" autocomplete="off" size="large"/>
      </el-form-item>
      <el-form-item label="开始时间" :label-width="100">
        <div class="formTime">
          <el-date-picker
              v-model="starttime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="x"
              size="large">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="结束时间" :label-width="100">
        <div class="formTime">
          <el-date-picker
              v-model="endtime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="x"
              size="large">
          </el-date-picker>
        </div>
      </el-form-item>
<!--      <el-row>-->
<!--        <el-col :span="24">-->
<!--          <el-form-item label="描述" :label-width="100" style="width: 680px">-->
<!--            <el-input v-model="form.describe" :rows="6" type="textarea" autocomplete="off"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <!--  v-if 比 v-for 的优先级更高，这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名。    -->
      <!--  在外先包装一层 <template> 再在其上使用 v-for 可以解决这个问题-->
      <template v-for="(value,key,index) in typeInfo">
        <el-form-item v-if="value.type ==='text'" :label="value.name" :label-width="100">
          <el-input v-model="value.value" autocomplete="off" size="large"/>
        </el-form-item>
      </template>
      <template v-for="(value,key) in typeInfo">
        <el-form-item v-if="value.type ==='select'" :label="value.name">
          <el-select v-model="value.value" placeholder="请选择" size="large">
            <el-option
                v-for="item in value.content"
                :label="item.lable"
                :value="item.lable"/>
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancelAddNote">取消</el-button>
      <el-button type="primary" @click="commitAddNote">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus'
import {plotType} from '@/cesium/plot/plotType.js'
import {useCesiumStore} from "@/store/modules/cesium.js";
import {insertPlotAndInfo} from '@/api/system/plot.js'

export default {
  name: "addMarkDialog",
  data() {
    return {
      DialogFormVisible: false,
      form: null,
      typeInfo: null,
      starttime:null,
      endtime:null
    }
  },
  props: [
    'addMarkDialogFormVisible', 'pointInfo'
  ],
  watch: {
    addMarkDialogFormVisible() {
      // 1-1 显示弹窗
      this.DialogFormVisible = this.addMarkDialogFormVisible
      // 2-1 获取pinia中存的经纬度、标绘类型等信息以及生成对应类型的dialog
      let cesiumStore = useCesiumStore()
      if(this.addMarkDialogFormVisible){
        // 2-2 获取pinia中数据
        this.form = cesiumStore.getPointInfo1()
        // 2-3 生成对应类型的dialog
        for (let item in plotType) {
          if (this.form.plottype === plotType[item].name) {
            // 此处对plotType[item]用json的parse和stringify是因为需要深拷贝，而{...plotType[item]}是浅拷贝
            this.typeInfo = JSON.parse(JSON.stringify(plotType[item]))//{...plotType[item]}
            break;
          }
        }
      }
    },
  },
  methods: {
    // 取消添加标注
    cancelAddNote() {
      // 清空typeInfo信息、starttime、endtime
      this.typeInfo = null
      this.starttime = null
      this.endtime = null
      this.$emit('clearMarkDialogForm')// 调用父组件中clearMarkDialogForm对应的方法，重置标绘信息填写框里的信息
    },
    //确认添加标注
    commitAddNote() {
      let that = this
      let data = this.assembleData(this.form,this.typeInfo,this.starttime,this.endtime)
      insertPlotAndInfo(data).then(res=>{
        this.$emit('drawPoint', data.plot)
        // 此处新定义变量存form是因为传过来给this.from的个promise包着的对象，传给ws会有问题
        let form = {...this.form}
        console.log(form)
        this.$emit('wsSendPoint', JSON.stringify({type: "point", operate: "add", data: form}))
        this.$emit('clearMarkDialogForm') // 调用父组件中clearMarkDialogForm对应的方法，重置标绘信息填写框里的信息
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
        // 清空typeInfo信息、starttime、endtime
        this.typeInfo = null
        this.starttime = null
        this.endtime = null
      })
    },

    // 组装成发送请求的数据形式
    assembleData(data1,data2,starttime,endtime){
      let assemblyData = {
        plot:{
          eqid:null,
          plotid:null,
          time:null,
          plottype:null,
          drawtype:null,
          latitude:null,
          longitude:null,
          height:null,
          img:null
        },
        plotinfo:{
          plotid:null,
          starttime:null,
          endtime:null,
          info:null,
          id:null
        }
      }
      // 组装 plot
      assemblyData.plot.eqid = data1.eqid
      assemblyData.plot.plotid = data1.plotid
      assemblyData.plot.time = Date.now() // 标绘主表的时间是系统生成时间，而不是手动选的标绘时间
      assemblyData.plot.plottype = data1.plottype
      assemblyData.plot.drawtype = "point" // 点线面后面再判断，先写点，别忘了改！！！！
      assemblyData.plot.latitude = data1.latitude
      assemblyData.plot.longitude = data1.longitude
      assemblyData.plot.height = data1.height
      assemblyData.plot.img = data1.img
      // 组装plotinfo
      assemblyData.plotinfo.plotid = data1.plotid
      assemblyData.plotinfo.starttime = starttime
      assemblyData.plotinfo.endtime = endtime
      assemblyData.plotinfo.info = JSON.stringify(data2)
      assemblyData.plotinfo.id = this.guid()

      return assemblyData
    },

    // 时间戳转换成日期格式，将时间戳转换成 xx年xx月xx日xx时xx分xx秒格式
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
      return `${year}年${month}月${day}日${hh}时${mm}分${ss}秒`
    },

    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
}
</script>

<style scoped>
.dialogDiv {
  position: absolute;
  /*padding: 20px;*/
  /*border-radius: 5px;*/
  /*top:100px;*/
  /*left: 10px;*/
  z-index: 10; /* 更高的层级 */
  /*background-color: rgba(40, 40, 40, 0.7);*/
}

.el-input {
  --el-input-width: 220px !important;
}

.el-select {
  /* 此版本下的select下拉框跟inline属性有bug，当设置inline时，select的宽度会丢失，因此需要手动设置 */
  --el-select-width: 150px !important;
}

</style>
