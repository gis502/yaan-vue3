
<template>
  <div>
    <div class="emergency_response" v-show="emergency_response_isExpanded">
      <p class="title">应急响应</p>
      <div class="emergency_response_expand_button" @click="emergency_response_toggleExpand">
        <img src="../../assets/icons/TimeLine/收起展开箭头左.png" style="height: 100%;width: 100%">
      </div>
      <div class="emergency_response_title-underline"></div>

      <p class="emergency_response_department"><span>{{this.activity.department}}</span> </p>
      <p class="emergency_response_responseName"><span>{{this.activity.ResponseName}}</span> <span class="emergency_response_state">{{this.activity.state}}</span></p>

      <div class="emergency_response_title-underline"></div>
      <p class="time_text"> 数据更新时间</p>
      <p class="time"> {{this.activity.time}}</p>
    </div>

    <div v-show="!emergency_response_isExpanded">
      <div class="emergency_response_notexpand_button" @click="emergency_response_toggleExpand">
        <img src="../../assets/icons/TimeLine/收起展开箭头右.png" style="height: 100%;width: 100%">
      </div>
    </div>
  </div>


</template>


<script>
import Response from "@/assets/json/TimeLine/EmergencyResponse";
export default {
  data() {
    return {
      Responsecontent:'',
      activity:{
        ResponseName: '',
        state: '',
        department: '',
        time: '',
      },
      emergency_response_isExpanded:'true'
    }
  },
  props: [
    'currentTime'
  ],
  mounted() {
    this.init()
  },
  watch: {
    currentTime(newVal) {
      this.updateEmergencyResponse(newVal)
    }
  },
  methods: {
    init() {
      this.Responsecontent = [...Response]
    },
    updateEmergencyResponse(currentTime){
      const activities = this.Responsecontent.filter((activity) => {
        return (
            new Date(activity[0]) <= currentTime
        );
      });
      if(activities.length>=1){
        activities.sort((a, b) => {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          return 0;
        });
        let tmp=activities[activities.length-1]
        // console.log(tmp)
        this.activity.time=tmp[0]
        this.activity.department=tmp[1]
        this.activity.ResponseName=tmp[2]
        this.activity.state=tmp[3]
      }

    },
    emergency_response_toggleExpand() {
      this.emergency_response_isExpanded = !this.emergency_response_isExpanded
    }
  }
}
</script>

<style>
.emergency_response {
  position: absolute;
  width: 25%; /* 调整宽度 */
  height: 22%;
  padding: 10px;
  border-radius: 5px;
  top: 5%;
  left: 1%;
  z-index: 20; /* 提高层级 */
  background-color: rgba(40, 40, 40, 0.7);
}


.title{
  margin: 0.9px;
  font-size: 1.1rem;
  font-weight: normal;
  font-family: 'myFirstFont', sans-serif;
  color: #ffffff;
}

.emergency_response_expand_button{
  position: absolute;
  width: 12%; /* 调整宽度 */
  //height: 25%;
  padding: 10px;
  border-radius: 5px;
  top: 0%;
  right: 1%;
  z-index: 22; /* 提高层级 */
}
.emergency_response_notexpand_button{
  position: absolute;
  width: 3%; /* 调整宽度 */
  //height: 6%;
  padding: 10px;
  border-radius: 5px;
  top: 5%;
  left: 1%;
  z-index: 22; /* 提高层级 */
  //background-color: #C03639;
}

.emergency_response_title-underline {
  width: 100%;
  height: 1px;
  background-color: #FFFFFF;
  margin-top: 1px;
}

.emergency_response_department {
  font-size: 1rem;
  line-height: 0rem;
  font-weight: bold;
  font-family: 'myFirstFont', sans-serif;
  color: #ffffff;
}

.emergency_response_responseName{
  font-size: 1.3rem;
  line-height: 0.5rem;
  font-weight: bold;
  font-family: 'myFirstFont', sans-serif;
  color: #419fff;
}
.emergency_response_state {
  font-size: 0.9rem;
  line-height: 0.3rem;
  font-weight: normal;
  font-family: 'myFirstFont', sans-serif;
  color: #ffffff;
}c

.time_text{
  margin: 1px;
  font-size: 0.9rem;
  font-weight: normal;
  font-family: 'myFirstFont', sans-serif;
  color: #ffffff;
}
.time{
  margin: 0px;
  font-size: 0.9rem;
  font-weight: normal;
  font-family: 'myFirstFont', sans-serif;
  color: #ffffff;
}
</style>