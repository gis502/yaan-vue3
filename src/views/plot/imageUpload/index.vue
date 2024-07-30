<template>
  <div class="data-container">
    <el-form class="form-container">
      <el-row>
        <el-col :span="8" :xs="24">
          <el-form-item label="名称">
            <el-input disabled v-model="formData.name" placeholder="请输入名称..."/>
          </el-form-item>
        </el-col>
        <el-col :span="2" :xs="0"></el-col>
        <el-col :span="14" :xs="24">
          <el-form-item label="时间">
            <el-date-picker
              v-model="startEndTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="起始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item class="form-row" label="信息">
        <el-input v-model="formData.info" placeholder="请输入信息..." type="textarea"/>
      </el-form-item>

      <el-form-item class="form-row" label="地震">
        <el-select v-model="selectedEq" placeholder="请选择地震..." style="width: 100%;">
          <el-option
            v-for="item in eqName"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-row class="form-row">
        <el-col :span="8" :xs="24">
          <div>
            <span class="location">经度</span>
            <el-form-item>
              <el-input v-model="formData.longitude" placeholder="请输入经度..."/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="2" :xs="0"></el-col>
        <el-col :span="8" :xs="24">
          <div>
            <span class="location">纬度</span>
            <el-form-item>
              <el-input v-model="formData.latitude" placeholder="请输入纬度..."/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="2" :xs="0"></el-col>
        <el-col :span="4" :xs="24">
          <el-button @click="getLocation" class="getLocation">获取经纬度</el-button>
        </el-col>
      </el-row>
      <el-row class="form-row">
        <el-col :span="18" :xs="24">
          <el-form-item label="上传图片">
            <el-upload
              action="#"
              :on-change="uploadOnChange"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :multiple="true"
              :limit="0">
              <el-icon>
                <Plus/>
              </el-icon>
              <template #file="{ file }">
                <img class="el-upload-list__item-thumbnail" :src="file.url">
                <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete" @click="deleteUnloadPic(file)">
                <el-icon><Delete/></el-icon>
              </span>
            </span>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="deleteAll()">清空图片</el-button>
      <el-form-item style="margin-top: 20px;">
        <el-button @click="submit()">提交</el-button>
        <el-button @click="clear()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getAllEq} from "../../../api/system/eqlist.js";
import {insertPlotAndInfo} from "../../../api/system/plot.js";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      startEndTime: '',
      getEqData: [],
      eqName: [],
      img: null,
      fileList: [],
      selectedEq: null,
      location: null,
      error: null,

      formData: {
        name: "快速标绘",
        info: null,
        eqId: null,
        longitude: null,
        latitude: null,
        img: [],
      },
      formDataCopy: {},
      startTimestamp: null,
      endTimestamp: null,
    };
  },

  mounted() {
    this.getEq();
  },

  watch: {
    startEndTime(newVal) {
      if (newVal && newVal.length === 2) {
        this.startTimestamp = new Date(newVal[0]).getTime();
        this.endTimestamp = new Date(newVal[1]).getTime();
        console.log('起始时间戳:', this.startTimestamp);
        console.log('结束时间戳:', this.endTimestamp);
      }
    },
    selectedEq(newValue) {
      const selectedEqData = this.getEqData.find(eq => {
        const date = eq.time.split(' ')[0];
        const magnitude = eq.magnitude;
        const position = eq.position;
        const eqLabel = `${date} ${magnitude}级 ${position}`;
        return eqLabel === newValue;
      });
      this.formData.eqId = selectedEqData ? selectedEqData.eqid : null;
      console.log('Selected eqId:', this.formData.eqId);
    }
  },

  methods: {
    getLocation() {
      event.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.sendPosition, this.showError);
      } else {
        alert("此浏览器不支持地理定位");
      }
    },
    sendPosition(position) {
      this.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.formData.longitude = this.location.longitude;
      this.formData.latitude = this.location.latitude;
      console.log(`Latitude: ${this.location.latitude}, Longitude: ${this.location.longitude}`);
    },
    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
      }
    },
    getEq() {
      getAllEq().then(res => {
        this.getEqData = res;
        console.log(this.getEqData)
        this.eqName = this.getEqData.map(eq => {
          const date = eq.time.split(' ')[0];
          const magnitude = eq.magnitude;
          const position = eq.position;
          return `${date} ${magnitude}级 ${position}`;
        });
      });
    },
    // 在dialog对话框中上传img时触发
    async uploadOnChange(file, fileList) {
      let imgBase64 = await this.getBase64(file.raw);
      this.img = imgBase64;
      this.fileList = fileList;
      this.formData.img.push(imgBase64);
      console.log("上传后");
      console.log(this.formData.img);
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      });
    },
    deleteUnloadPic(file) {
      const index = this.fileList.findIndex(item => item.uid === file.uid);
      if (index > -1) {
        this.fileList.splice(index, 1);
        this.formData.img.splice(index, 1);
        console.log("删除后");
        console.log(this.formData.img);
      }
    },
    deleteAll() {
      this.fileList = []
      this.formData.img = []
      console.log("清空后")
      console.log(this.formData.img)
    },
    submit() {
      console.log(this.formData)
      this.copyFormData()
      console.log(111)
      console.log(this.formDataCopy)
      let data = this.assembleData(this.formData,this.formDataCopy,this.startTimestamp,this.endTimestamp)
      console.log(data)
      insertPlotAndInfo(data).then(res=>{
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
      })
      this.clear()
    },
    clear() {
      // 主要为了确保img属性为数组，避免.push报错
      this.formData = {
        name: "快速标绘",
        info: null,
        eqId: null,
        longitude: null,
        latitude: null,
        img: []
      };
      this.formDataCopy = {
        name: "快速标绘",
        info: null,
        eqId: null,
        longitude: null,
        latitude: null,
        img: []
      };
      this.startEndTime = ''
      this.img = []
      this.fileList = []
      this.selectedEq = null
      this.location = null
    },

    assembleData(data1,data2,startTime,endTime){
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
          img:[]
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
      assemblyData.plot.eqid = data1.eqId
      assemblyData.plot.plotid = this.guid()
      assemblyData.plot.time = Date.now() // 标绘主表的时间是系统生成时间，而不是手动选的标绘时间
      assemblyData.plot.plottype = "快速标绘" //默认为快速标绘
      assemblyData.plot.drawtype = "point" // 点线面后面再判断，先写点，别忘了改！！！！
      assemblyData.plot.latitude = data1.latitude
      assemblyData.plot.longitude = data1.longitude
      assemblyData.plot.height = 0.0
      assemblyData.plot.img = data1.img[0]
      // 组装plotinfo
      assemblyData.plotinfo.plotid = assemblyData.plot.plotid
      assemblyData.plotinfo.starttime = startTime
      assemblyData.plotinfo.endtime = endTime
      assemblyData.plotinfo.info = JSON.stringify(data2)
      assemblyData.plotinfo.id = this.guid()

      return assemblyData
    },

    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    copyFormData() {
      // 使用解构赋值去掉不需要的属性
      const { eqId, longitude, latitude, ...rest } = this.formData;
      this.formDataCopy = { ...rest };
    }
  }
};
</script>

<style scoped lang="scss">
.data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  overflow: auto;
}

.location {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.getLocation {
  margin-top: 30px;
  height: 35px;
  width: 100%;
}

.form-row {
  margin-top: 50px;
}

.el-upload {
  width: 100%;
}

/* Mobile adaptation */
@media only screen and (max-width: 600px) {
  .data-container {
    padding-top: 400px;
    flex-direction: column;
    align-items: flex-start;
  }

  .el-row {
    flex-direction: column;
  }

  .el-col {
    width: 100% !important;
    margin-bottom: 20px;
  }

  .form-container {
    width: 100%;
  }
}
</style>
