
<template>
  <div>
    <div class="personnel_casualties" v-show="personnel_casualties_isExpanded">
      <p class="title">人员伤亡</p>

      <div class="personnel_casualties_expand_button" @click="personnel_casualties_toggleExpand">
        <img src="../../assets/icons/TimeLine/收起展开箭头左.png" style="height: 100%;width: 100%">
      </div>

      <div class="title-underline"></div>



      <ul class="total-list">
        <li>
          <p>
            <span>{{this.activity.death}}</span> 人
          </p>
          <p>死亡人数 </p>
        </li>
        <li >
          <p>
            <span>{{this.activity.miss}} </span> 个
          </p>
          <p>失联人数</p>
        </li>
        <li>
          <p>
            <span> {{this.activity.injure}} </span> 个
          </p>
          <p>受伤人数 </p>
        </li>
      </ul>

      <div class="title-underline"></div>
      <p class="time_text"> 数据更新时间</p>
      <p class="time"> {{this.activity.time}}</p>
    </div>

    <div v-show="!personnel_casualties_isExpanded">
      <div class="personnel_casualties_notexpand_button" @click="personnel_casualties_toggleExpand">
        <img src="../../assets/icons/TimeLine/收起展开箭头右.png" style="height: 100%;width: 100%">
      </div>
    </div>
  </div>


</template>


<script>
import PersonnelCasualties from "@/assets/json/TimeLine/PersonnelCasualties";
export default {
  data() {
    return {
      Responsecontent:'',
      activity:{
        time: '',
        death: '',
        miss: '',
        injure: '',
      },
      personnel_casualties_isExpanded:'true'
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
      this.personnel_casualties_update(newVal)
    }
  },
  methods: {
    init() {
      this.Responsecontent = [...PersonnelCasualties]
      // console.log(this.Responsecontent)
    },
    personnel_casualties_update(currentTime){
      console.log("personnel_casualties_update",this.Responsecontent)
      console.log(currentTime)
      const activities = this.Responsecontent.filter((activity) => {
        return (
            new Date(activity[0]) <= currentTime
        );
      });
      if(activities.length>=1){
        console.log("activities",activities)
        activities.sort((a, b) => {
          if (a[0] < b[0]) return -1;
          if (a[0] > b[0]) return 1;
          return 0;
        });
        let tmp=activities[activities.length-1]
        this.activity.time=tmp[0]
        this.activity.death=tmp[1]
        this.activity.miss=tmp[2]
        this.activity.injure=tmp[3]
      }

    },
    personnel_casualties_toggleExpand() {
      this.personnel_casualties_isExpanded = !this.personnel_casualties_isExpanded
    }
  }
}
</script>

<style>
.personnel_casualties {
  position: absolute;
  top: 28%;
  width: 25%;
  height: 23%;
  padding: 10px;
  border-radius: 5px;
  left: 1%;
  z-index: 20;
  background-color: rgba(40, 40, 40, 0.7);
}
.title{
  margin: 0.9px;
  font-size: 1.1rem;
  font-weight: normal;
  font-family: 'myFirstFont', sans-serif;
  color: #ffffff;
}

.personnel_casualties_expand_button {
  position: absolute;
  width: 12%; /* 调整宽度 */
  //height: 25%;
  padding: 10px;
  border-radius: 5px;
  top: 0%;
  right: 1%;
  z-index: 22; /* 提高层级 */
}

.personnel_casualties_notexpand_button {
  position: absolute;
  width: 3%; /* 调整宽度 */
  padding: 10px;
  border-radius: 5px;
  top: 28%;
  left: 1%;
  z-index: 22; /* 提高层级 */
}

.title-underline {
  width: 100%;
  height: 1px;
  background-color: #FFFFFF;
  margin-top: 0px;
}

.total-list {
  height: 30%;
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  color: #fff; /* 设置文字颜色为白色 */
}

.total-list li {
  text-align: center;
  margin: 0 20px;
}

.total-list li p {
  margin: 0;
  font-size: 0.9rem;
}

.total-list li p:first-child {
  font-size: 0.9rem;
  font-weight: normal;
}

.total-list li p span {
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 5px;
  color: #c0383b;
}

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