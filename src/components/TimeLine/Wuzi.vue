<script setup>

</script>

<template>
  <div>
    <div>

      <ul class="total-list">
        <li>
          <p>
            <span>1000 </span> 个
          </p>
          <p>帐篷 </p>
        </li>
        <li>
          <p>
            <span>1200</span> 个
          </p>
          <p> 折叠床</p>
        </li>
        <li >
          <p>
            <span>2000 </span> 个
          </p>
          <p>棉被</p>
        </li>
      </ul>
    </div>


    <ul class="info-list">
      <li>
        <p>数据更新时间</p>
        <!-- <p v-html="eqinfo.sjgxsj"></p> -->
        <p>2022-06-01 17:04:06</p>
      </li>

    </ul>


  </div>
</template>
<style>

@media screen and (min-width: 1440px) {
  html {
    font-size: 50%;
  }
}

@media screen and (min-width: 1920px) {
  html {
    font-size: 8px;
  }
}

@media screen and (min-width: 2560px) {
  html {
    font-size: 100%;
  }
}

p,
h2,
ul {
  margin: 0;
  padding: 0;
}

.map-header {
  position: absolute;
  top: 0;
  left: 0;
  height: 8rem;
  width: 100%;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
}

.map-header::after {
  display: block;
  content: "";
  clear: both;
}

.map-header h1 {
  float: left;
  font-family: myFirstFont;
  font-size: 4rem;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.73);
  line-height: 8rem;
  margin: 0rem 3rem;
}

.map-header .info {
  float: left;
  font-family: myFirstFont;
  font-size: 3.5rem;
  color: #f9ee35;
  letter-spacing: 0;
  height: 8rem;
}

.map-header .info::after {
  display: inline-block;
  content: "";
  height: 8rem;
  vertical-align: middle;
}

.map-header .info img {
  display: inline-block;
  width: 3.2rem;
  height: 3.2rem;
  vertical-align: middle;
  margin-right: 1.5rem;
}

.map-header .info .msg-p {
  display: inline-block;
  width: 65rem;
  overflow: hidden;
  position: relative;
  height: 8rem;
  vertical-align: middle;
}

.map-header .info .msg-p .msg {
  position: absolute;
  display: inline-block;
  margin: 0 2rem;
  line-height: 8rem;
  white-space: nowrap;
}

.map-header .w-Ther {
  display: flex;
  float: right;
  margin-left: 1rem;
  vertical-align: middle;
}

.map-header .w-Ther .weather {
  display: inline-block;
  box-sizing: border-box;
  padding: 0 1rem 0;
  font-family: myFirstFont;
  font-size: 2rem;
  color: #ffffff;
  letter-spacing: 0;
  position: relative;
  height: 8rem;
  vertical-align: top;
}

.map-header .w-Ther .weather .first {
  height: 4rem;
}

.map-header .w-Ther .weather .first .current {
  display: inline-block;
  font-size: 2.5rem;
  line-height: 4rem;
}

.map-header .w-Ther .weather .first .temp {
  line-height: 3rem;
  float: left;
}

.map-header .w-Ther .weather .second .rain {
  line-height: 4rem;
}

.map-header .w-Ther .weather .second .wind {
  line-height: 4rem;
  margin-left: 2rem;
}

.map-header .w-Ther .w-img {
  display: inline-block;
  vertical-align: top;
}

.map-header .w-Ther .w-img img {
  height: 8rem;
}

.map-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 8rem;
  width: 100%;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  opacity: 0.8;
}

.map-footer::after {
  display: block;
  content: "";
  clear: both;
}

.map-footer .leg {
  float: left;
  list-style: none;
}

.map-footer .leg img {
  display: inline-block;
  width: 16px;
  margin-left: 5px;
  vertical-align: middle;
}

.map-footer .leg::after {
  display: inline-block;
  content: "";
  height: 8rem;
  vertical-align: middle;
}

.map-footer .leg > li {
  display: inline-block;
  margin-right: 1rem;
  font-family: myFirstFont;
  font-size: 2.7rem;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 8rem;
  text-shadow: 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.39);
  position: relative;
  height: 8rem;
  width: 18rem;
  vertical-align: middle;
}

.map-footer .leg > li:hover .sub-menu {
  display: block;
}

.map-footer .leg > li .sub-menu {
  display: none;
  position: absolute;
  width: 18rem;
  bottom: 8rem;
  list-style: none;
  padding: 1rem;
  background-image: linear-gradient(180deg, #212239 0%, #1b2132 100%);
  box-shadow: 0 -0.9rem 1rem 0 rgba(0, 0, 0, 0.28);
}

.map-footer .leg > li .sub-menu li {
  font-family: PingFangSC-Regular;
  font-size: 2rem;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
  line-height: 4.5rem;
  height: 4.5rem;
}

.map-footer .leg > li .sub-menu li::after {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  content: "";
}

.map-footer .leg > li .sub-menu li::before {
  display: block;
  content: "";
  clear: both;
}

.map-footer .leg > li .sub-menu li img {
  display: inline-block;
  height: 3rem;
  width: 3rem;
  vertical-align: middle;
}

.map-footer .leg > li .sub-menu li .check {
  float: right;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  position: relative;
  top: 50%;
  transform: translateY(-1rem);
}

.map-footer .leg > li .sub-menu li .add-label {
  float: right;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  position: relative;
  top: 50%;
  transform: translateY(-1rem);
}

.map-footer .leg > li .sub-menu li input[type="checkbox"] {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  z-index: 5;
  opacity: 0;
  cursor: pointer;
}

.map-footer .leg > li .sub-menu li input[type="checkbox"] + .inner-check {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  background: #fff;
  z-index: 4;
}

.map-footer
.leg
> li
.sub-menu
li
input[type="checkbox"]:checked
+ .inner-check {
  background: red;
  transition: 1s all;
}

.map-footer .leg > li .sub-menu li input[type="checkbox"] + .inner-check i {
  display: none;
}

.map-footer
.leg
> li
.sub-menu
li
input[type="checkbox"]:checked
+ .inner-check
i {
  display: inline-block;
  position: absolute;
  top: 0;
}

.map-footer
.leg
> li
.sub-menu
li
input[type="checkbox"]:checked
input[type="checkbox"]::before {
  background: red;
}

.map-footer .measure {
  display: inline-block;
  float: left;
  vertical-align: middle;
  height: 100%;
  font-size: 21px;
  color: #fff;
}

.map-footer .measure p {
  display: block;
  height: 32px;
  line-height: 32px;
  text-align: left;
}

.map-footer .measure p span {
  font-size: 21px;
}

.map-footer .measure p .start {
  color: #67c23a;
}

.map-footer .measure p .end {
  color: #67c23a;
}

.map-footer .measure p .dis {
  color: #409eff;
}

.map-footer .tool {
  display: inline-block;
  margin: 2rem 0;
  position: absolute;
  right: 3rem;
}

.map-footer .tool img {
  width: 3.5rem;
  height: 3.5rem;
  margin-right: 6rem;
  cursor: pointer;
}

.map-footer .tool img:last-child {
  margin-right: 0;
}

.tools {
  position: absolute;
  top: 10rem;
  left: 1.5rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 1rem;
  width: 34.5rem;
  /* height: 52.5rem; */
  opacity: 0.8;
  /* padding: 1rem 1rem; */
}

.tools .group {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

{
  position: absolute;
  top: 21rem;
  left: 1.5rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 1rem;
  width: 34.5rem;
  opacity: 0.8;
  padding: 0 1rem;
}

.total-list {
  margin-top: 0.5rem;
}

.total-num {
  font-family: myFirstFont;
  color: #2be5c4;
  letter-spacing: 0;
  text-align: justify;
  margin: 1.5rem 0 0 0.5rem;
  font-size: 2rem;
  line-height: 2.7rem;
}

.total-num span {
  margin-right: 10px;
  font-size: 4rem;
  line-height: 4.5rem;
}

.total-des {
  font-family: myFirstFont;
  font-size: 2rem;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 3rem;
  margin-left: 0.5rem;
  text-align: left;
}

.total-list {
  list-style: none;
  margin: 0.5rem 0 0 6px;
  padding-bottom: 1rem;
  text-align: left;
  border-bottom: 0.2rem solid #98a1c5;
}

.total-list li {
  display: inline-block;
  font-family: myFirstFont;
  font-size: 5rem;
  color: #ffffff;
  letter-spacing: 0;
  width: 10rem;
  margin-right: 0.5rem;
}

.total-list li p {
  font-size: 1.2rem;
  line-height: 2rem;
}

.total-list li p span {
  font-size: 2.3rem;
  line-height: 3.5rem;
  font-weight: bolder;
}

.total-list li p:last-child {
  font-size: 2rem;
  line-height: 3rem;
}

.info-list {
  list-style: none;
  text-align: left;
  padding: 0.5rem 0 0.5rem;
  border-bottom: 0.2rem solid #98a1c5;
}

.info-table {
  width: 100%;
  color: #fff;
  border: 1px solid;
  padding: 3px;
}

.info-table th {
  font-size: 14px;
}

.info-table td {
  font-size: 16px;
}

.info-table td {
  border: 1px solid;
}

.info-table th {
  border: 1px solid;
}

-1 .info-table {
     width: 100%;
     color: #fff;
     border: 1px solid;
     padding: 3px;
   }

-1 .info-table th {
     font-size: 14px;
   }

-1 .info-table td {
     font-size: 16px;
   }

-1 .info-table td {
     border: 1px solid;
   }

-1 .info-table th {
     border: 1px solid;
   }

.esri-widget__table {
  border-collapse: collapse;
}

.esri-widget__table td {
  border: 1px solid #fff !important;
}

.esri-widget__table th {
  border: 1px solid #fff !important;
}

.info-list li {
  display: inline-block;
}

.info-list li p {
  font-family: myFirstFont;
  font-size: 2rem;
  color: #2be5c4;
  letter-spacing: 0;
  line-height: 3rem;
  margin-right: 1.5rem;
}

.info-list li span {
  font-size: 4rem;
  line-height: 5.5rem;
}

.info-list p:last-child {
  font-size: 2rem;
  color: #ffffff;
  line-height: 2.5rem;
}

.info-list:last-child {
  border: none;
}

.info-list:last-child li p {
  font-size: 2rem;
  line-height: 3.5rem;
}

.info-list:last-child li:last-child p:last-child {
  font-size: 2.5rem;
  line-height: 3.5rem;
  font-weight: bolder;
  color: #fd015d;
}

-1 {
  display: block;
  position: absolute;
  top: 21rem;
  left: 1.5rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 1rem;
  width: 34.5rem;
  opacity: 0.8;
  padding: 0 1rem;
}

-1 .info-list {
     list-style: none;
     text-align: left;
     padding: 0.5rem 0 0.5rem;
     border-bottom: 0.2rem solid #98a1c5;
   }

-1 .info-list:last-child {
     border-top: 0.2rem solid #98a1c5;
   }

-1 .info-list li {
     display: inline-block;
   }

-1 .info-list li .total-num {
     color: red;
     font-size: 2.8rem;
   }

/*出队信息*/
-1 .info-list-2 li p {
     font-family: myFirstFont;
     font-size: 2.2rem;
     color: #c0c0c0;
     letter-spacing: 0;
     line-height: 3rem;
     margin-right: 1.5rem;
   }

-1 .info-list li p {
     font-family: myFirstFont;
     font-size: 2rem;
     color: #2be5c4;
     letter-spacing: 0;
     line-height: 1.5rem;
     margin-right: 1.5rem;
   }

-1 .info-list li span {
     font-family: myFirstFont;
     font-weight: bold;
     font-size: 2.8rem;
     line-height: 4rem;
     padding: 1rem 0 1rem !important;
     color: #ffffff;
   }

-1 .info-list p:last-child {
     font-size: 2rem;
     color: #ffffff;
     line-height: 2.5rem;
   }

-1 .info-list:last-child li p {
     font-size: 2rem;
     line-height: 3.5rem;
   }

-1 .info-list:last-child li:last-child p:last-child {
     font-size: 2.5rem;
     line-height: 3.5rem;
     font-weight: bolder;
     color: #fd015d;
   }

.label-tool,
.charts {
  position: absolute;
  top: 94.5rem;
  /*top: 77.5rem;*/
  left: 1.5rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 1rem;
  width: 34.5rem;
  opacity: 0.8;
  padding: 0 1rem;
}

.label-tool .el-form {
  padding: 10px;
}

.label-tool .el-form .el-form-item__label {
  color: #ffffff;
}


.label-tool .el-form .el-input {
  width: 200px;
}

.charts .inner-chart {
  height: 25rem;
}

.charts .el-carousel__container {
  height: 25rem;
}

#encochartplus #encochart {
  height: 28rem;
}

#encochartplus #peochart {
  height: 28rem;
}

#encochart div {
  position: relative;
  top: -20px;
}

#peochart div {
  position: relative;
  top: -10px;
}

.settlements > table td,
.settlements > table th {
  font-family: myFirstFont;
  font-size: 1.75rem;
  line-height: 2rem;
  color: #ffffff;
  border: 0px solid #fff;
  /* border-width: 0 0 0 1px; */
  /* font-size: inherit; */
  margin: 0;
  overflow: visible;
  padding: 0.5em 1em;
}

.settlements > table th {
  color: #2be5c4;
}

.settlements > table {
  width: 95%;
}

.settlements > table .local {
  cursor: pointer;
  border-bottom: 1px solid rgb(94, 153, 211);
  color: rgb(94, 153, 211);
}

.settlements > table .distant {
  border-bottom: 1px solid rgb(94, 153, 211);
}

.roadInfo {
  display: none;
}

.roadInfo > p,
.roadInfoButton > span {
  font-family: myFirstFont;
  font-size: 2rem;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 3rem;
  margin-left: 0.5rem;
  width: 80%;
  text-align: left;
}

.roadInfoButton {
  display: none;
}

.news {
  position: absolute;
  font-family: myFirstFont;
  top: 10rem;
  right: 1.5rem;
  width: 36rem !important;
  /* height: 50rem; */
  padding: 0 1rem 0 1rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 0.6rem;
  opacity: 0.8;
}

.news ul {
  margin: 1.5rem 0;
  text-align: left;
  list-style: none;
  overflow-y: scroll;
  height: 37rem;
}

/* 定义滚动条样式 */
.news ul::-webkit-scrollbar {
  width: 0.1rem;
  height: 40rem;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
.news ul::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0rem rgba(240, 240, 240, 0.5);
  border-radius: 1rem;
  background-color: rgba(240, 240, 240, 0.5);
}

/*定义滑块 内阴影+圆角*/
.news ul::-webkit-scrollbar-thumb {
  width: 1.2rem;
  border-radius: 0.6rem;
  border: 0.1rem solid #ffffff;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: rgba(240, 240, 240, 0.5);
}

.news ul li {
  margin-bottom: 1rem;
}

.news ul .info {
  position: relative;
}

.news ul .info p:first-child {
  top: 5rem;
}

.news ul .info p:last-child {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.news ul .high .info::after {
  position: absolute;
  left: -1.5rem;
  top: 0.4rem;
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  content: "";
  background: #36f6ff;
  border-radius: 50%;
}

.news ul .high p:last-child {
  color: #36f6ff;
}

.news .img {
  display: inline-block;
  height: 7.5rem;
  vertical-align: top;
  width: 9rem;
  text-align: center;
}

/* .news .el-tabs__nav {
  width: 100%;
}
.news .el-tabs__item {
  width: 33.33%;
}
.news .el-tabs__content {
  padding: 0;
} */
.news .img img {
  width: 7rem;
  height: 6.5rem;
}
.authorinfo {
  font-size: 1.7rem;
  color: #ffffff;
}
.authorinfotime {
  float:right;
}
.news .info {
  display: inline-block;
  /* margin-left: 2rem; */
  /* height: 107px; */
  width: 24rem;
  vertical-align: top;
}

.news .info p {
  opacity: 0.68;
  font-size: 1.7rem;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 2rem;
  margin: 0, 0.5rem;
}

.news .info p:last-child {
  font-size: 2.2rem;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 3rem;
}

.news .el-input {
  margin: 10px 0;
}

.news .search-marker .content {
  height: 40rem;
  overflow-y: auto;
}

.news .layer-infomation {
  height: auto;
  margin: 0;
}

.news .layer-infomation li {
  color: #fff;
  cursor: pointer;
}

.news .layer-infomation li .description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.esri-popup__content {
  line-height: 33px;
  padding-right: 14px;
}

.staticNewsCommit {
  position: absolute;
  top: 65.5rem;
  right: 1.5rem;
  width: 36rem !important;
  /* height: 30rem; */
  padding: 0 1rem 0 1rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 0.6rem;
  opacity: 0.8;
}

.staticNewsCommit #newsSum {
  font-family: myFirstFont;
  font-size: 2.8rem;
  line-height: 3.2rem;
  padding: 1rem 0 1rem !important;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
  text-shadow: 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.39);
  /*border-bottom: 0.1rem solid #ffffff;*/
}

.small-map {
  position: absolute;
  /*top: 75.5rem;*/
  top: 68.5rem;
  right: 1.5rem;
  width: 36rem !important;
  /* height: 30rem; */
  padding: 0 1rem 0 1rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 0.6rem;
}

.small-map #overviewDiv {
  padding: 0;
  margin: 1.5rem 0;
  height: 20rem;
  width: 100%;
}
/* 设置特定的字体大小 丁 */
.my-form-item .el-form-item__label {
  font-size: 18px;}

.small-map #thdmap {
  padding: 0;
  margin: 1.5rem 0;
  height: 20rem;
  width: 100%;
}

.eq-status {
  position: absolute;
  /*top: 105.5rem;*/
  top: 97.5rem;
  right: 1.5rem;
  width: 36rem;
  padding: 0 1rem 0 1rem;
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 0.6rem;
  opacity: 0.8;
}

.eq-time {
  font-family: myFirstFont;
  font-size: 2.8rem;
  line-height: 3.2rem;
  padding: 1rem 0 1rem !important;
  color: rgb(250, 241, 67);
  letter-spacing: 0;
  text-align: justify;
  text-shadow: 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.39);
}

.sub-title {
  font-family: myFirstFont;
  font-size: 2.8rem;
  line-height: 3.2rem;
  padding: 1rem 0 1rem !important;
  color: #ffffff;
  letter-spacing: 0;
  text-align: justify;
  text-shadow: 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.39);
  border-bottom: 0.1rem solid #ffffff;
}


/* .esri-ui-inner-container {
  display: none;
} */
/* .map-header {
    display: none;
  }
   {
    display: none;
  }
  .news {
    display: none;
  }
  .small-map {
    display: none;
  }
  .map-footer {
    display: none;
  } */
#earthStatus {
  position: absolute;
  left: -310px;
  font-size: 40px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0);
}

.thdimg {
  width: 100%;
}

.thd-map {
  height: 100%;
}

.home-container .content-container .thd-map {
  height: 50%;
  background-color: transparent;
  padding: 0.3rem 0.2rem;
  position: relative;
}

.home-container .content-container .overviewDiv {
  height: 100%;
}

.thd-near {
  margin-top: 0.5rem;
  background-color: transparent;
}

@media only screen and (min-width: 760px) {
  .thd-near {
    margin-top: 0;
  }

  .thd-map {
    padding: 0;
  }
}

.thd-near div {
  background-color: transparent;
}

.thd-near-group {
  display: block;
}

.thd-near-item p {
  margin: 0;
}

.thd-near-item {
  display: inline-block;
  width: 45%;
  background-color: #fff !important;
  position: relative;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.thd-near-item:after {
  content: "";
  clear: both;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 1px 0 #b9b3b3;
  width: 100%;
  height: 100%;
}

.thd-near-item:first-child {
  margin-right: 3%;
  margin-bottom: 1rem;
}

.thd-near-item:nth-child(3) {
  margin-right: 3%;
}

.thd-near-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.2rem;
  padding-left: 0.3rem;
  padding-right: 0.1rem;
  margin-bottom: 1rem;
  position: relative;
  font-size: 12px;
  color: #444242;
  font-weight: 700;
}

.thd-near-title:before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  clear: both;
  border-left: 2px solid #ec0707;
  height: 100%;
}


.thd-near-name {
  color: #000;
  height: 16px;
  width: 65px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.thd-near-content {
  font-size: 12px;
  text-align: center;
  font-weight: 700;
  display: flex;
}

.thd-near-control {
  width: calc(100% / 3);
}

p.thd-near-label {
  margin-bottom: 0.3rem;
  color: #736f6f;
  font-size: 10px;
}

p.thd-near-int {
  color: #e80e0e;
}

.thd-his {
  background-color: transparent;
  width: 95%;
}

.thd-his div {
  background-color: transparent;
}

.thd-his p {
  margin: 0;
}

.thd-his-title {
  text-align: left;
  margin-top: 2rem;
  margin-bottom: 0.8rem;
}

.thd-his-title h3 {
  display: inline-block;
  padding: 0.2rem 0.3rem;
  background-color: #bdb5b5;
  border-radius: 5px;
  color: #f5eeee;
}

.thd-his-item {
  display: flex;
  text-align: center;
  margin-bottom: 0.5rem;
}

.thd-his-date {
  font-size: 15px;
  font-weight: 700;
  margin-right: 1rem;
  width: 5.1rem;
}

.thd-his-content {
  display: flex;
  flex-direction: column;
}

.thd-his-addr {
  display: flex;
}

.thd-his-icon {
  width: 1rem;
  margin-right: 0.5rem;
}

.thd-his-name {
  font-size: 15px;
  font-weight: 700;
}

.thd-his-detail {
  display: flex;
  font-weight: 500;
  position: relative;
  font-size: 12px;
  padding-left: 1rem;
  padding-top: 0.8rem;
  margin-left: 0.5rem;
}

.thd-his-detail:before {
  content: "";
  clear: both;
  position: absolute;
  top: 0;
  left: 0;
  border-left: 1px solid #000;
  height: 100%;
}

.thd-his-control {
  margin-right: 0.5rem;
}

p.thd-his-label {
  margin-bottom: 0.3rem;
  color: #5f5c5c;
  font-size: 10px;
}

p.thd-his-int {
  font-size: 15px;
}

.thd-map h4 {
  margin: 0;
  text-align: center;
}

.thd-map .map-control {
  display: none;
}

#eq_center_3D {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  margin-left: -100px;
  background-color: rgba(102, 102, 102, 0.068);
}

#eq_center_2D {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  margin-left: -100px;
  background-color: rgba(102, 102, 102, 0.068);
}

/* //arcmap */
.esri-ui-manual-container > .esri-popup > .esri-popup__main-container {
  background-image: linear-gradient(-180deg, #212239 0%, #1b2132 100%);
  border-radius: 1rem;
  width: 34.5rem;
  opacity: 0.8;
  padding: 0 1rem;
  width: 600px;
  height: 320px;
}

.esri-widget {
  box-sizing: border-box;
  color: #323232;
  font-size: 14px;
  font-family: "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 1.3em;
  background-color: #1b2132;
}

.esri-ui .esri-ui-top-left .esri-widget {
  background-color: #fff;
}

.esri-ui .esri-ui-top-right .esri-widget {
  background-color: #fff;
}

.esri-ui .esri-ui-inner-container > .esri-ui-corner {
  background-color: transparent;
}

.esri-ui-manual-container > .esri-popup > .esri-popup__main-container {
  width: 200px;
}

.esri-expand__container .esri-expand__panel .esri-widget-button {
  background-color: #fff;
}

#topbar {
  background: #fff;
}

.action-button {
  font-size: 16px;
  background-color: transparent;
  border: 1px solid #d3d3d3;
  color: #6e6e6e;
  height: 32px;
  width: 32px;
  text-align: center;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}

#distanceButton {
  height: 32px;
  width: 32px;
  margin: 0;
}

.action-button:hover,
.action-button:focus {
  background: #0079c1;
  color: #e4e4e4;
}

.active {
  background: #0079c1;
  color: #e4e4e4;
}

/* 截图 */
#screen {
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
}

.screenthd {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
}

#screenshotDiv {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
}

.screenhide {
  display: none;
}

.screenimg {
  border: 10px solid white;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
}

#screenshotDiv > * {
  margin: 0.5em;
}

.screenshotCursor {
  cursor: crosshair;
}

#screenshotBtn {
  height: 32px;
  width: 32px;
  margin: 0;
}

.screen-button {
  padding: 0.6em;
  background-color: transparent;
  border: 1px solid #d3d3d3;
  color: #6e6e6e;
  text-align: center;
  cursor: pointer;
}

.screen-button:hover,
.screen-button:focus {
  background: #0079c1;
  color: white;
}

#maskDiv {
  position: absolute;
  background: rgba(255, 51, 0, 0.1);
  border: 2px dashed rgb(255, 51, 0);
}

.esri-ui-manual-container > .esri-popup > .esri-popup__main-container {
  width: 600px;
  height: 380px;
}

.esri-popup__header-title {
  font-size: 25px !important;
  color: #fff;
  background-color: transparent !important; /*去掉讨厌的白色背景色*/
  margin: 10px 0 0 !important;
  z-index: -999 !important;
}

/* .esri-popup__header-buttons > div:first-child {
  display: flex;
} */
.esri-popup__header-buttons .esri-popup__button--dock {
  display: none;
}

.esri-ui-corner .esri-component.esri-widget--panel {
  width: 200px !important;
  font-size: 15px !important;
}

.esri-editor__content {
  min-height: 10vh !important;
}

.esri-search {
  width: 200px !important;
}

.esri-widget__table tr td {
  text-align: left;
  font-size: 20px !important;
  color: #fff;
}

.esri-widget__table tr th {
  width: 30% !important;
  font-size: 20px !important;
  text-align: center !important;
  color: #fff;
}

.esri-editor__overlay .esri-editor__warning-card {
  background-color: white !important;
}

/* 量算组件位置 */
.esri-ui-bottom-right {
  bottom: 10rem !important;
  right: 35rem !important;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}


.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
/* 样式修改啊啊啊 */
.el-tabs__item {
  width: 143px;
  height: 35px;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}


/* 样式修改啊啊啊 * 丁/
/* .el-tabs__item is-top .el-tabs__item {
  width: 120px;
  height: 35px;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
} */

.el-tabs__nav-scroll {
  color: #0079c1;
  background-color: #eceef3;
}

.el-tabs__card > .el-tabs__header .el-tabs__nav {
  border: none;
}
.el-tabs__nav-next, .el-tabs__nav-prev {
  position: absolute;
  cursor: pointer;
  line-height: 44px;
  font-size: 12px;
  color: #90939914;
}
/* 添加的样式 丁 */
.el-tabs__nav-wrap.is-scrollable {
  padding: 0.5px 0.1px;
  box-sizing: border-box;
}

/* 之前是10 */
.el-tabs__content {
  padding: -5px;
}

.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background-color: rgba(255, 255, 255, 100);
  color: rgba(97, 154, 241, 100);

}


.esri-feature-content span {
  color: #fff;
  text-indent: 30px;
  text-align: justify;
  letter-spacing: 0.5px;
}



</style>