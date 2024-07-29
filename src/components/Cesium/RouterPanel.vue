<template>
  <div class="videoMonitorWin" v-if="visiblePanel" :style="styleObject">
    <div class="ponpTitle">信息面板</div>
    <div class="ponpTable">
      <div class="info-item" v-for="(value, key) in popupPanelData" :key="key">
        <div class="info-label">{{ keyToChinese(key) }}</div>
        <div class="info-value">{{ value }}</div>
      </div>
    </div>
<!--    <el-button @click="deletePoint" type="danger" icon="el-icon-delete" circle></el-button>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      visiblePanel: null,
      positionEntity: { x: 0, y: 0 },
      popupPanelData: {},
      keyMappings: {
        county: '县（区）',
        storagePointsCount: '储备库点数量（个）',
        totalKitsCount: '合计总件套数',
        disasterTentsCount: '救灾帐篷（顶）',
        cottonBlanketsCount: '棉被（床）',
        otherBlanketsCount: '其他被子（床）',
        cottonClothesCount: '棉衣裤（套）',
        cottonCoatsCount: '棉大衣（件）',
        otherClothesCount: '其他衣物（套、件）',
        woolBlanketsCount: '毛毯（床）',
        foldingBedsCount: '折叠床（张）',
        bunkBedsCount: '高低床（套）',
        stripedClothBundlesCount: '彩条布（包）',
        moistureMatsCount: '防潮垫（张）',
        generatorsCount: '发电机（台）',
        lightingFixturesCount: '照明灯具（个）',
        lightingKitsCount: '照明灯组（套）',
        flashlightsCount: '手电筒（支）',
        raincoatsCount: '雨衣（件）',
        rainBootsCount: '雨靴（双）',
        otherSuppliesCount: '其他装备数量（个）',
        address: '地址',
        lon: '经度',
        lat: '纬度',
        contactPerson: '联系人',
        contactPhone: '联系电话',
        insertTime: '插入时间',
        // id: 'ID', // 如果需要显示ID，可以取消注释
      }
    }
  },
  props: ['popupData', 'position', 'visible'],
  watch: {
    visible() {
      this.visiblePanel = this.visible;
    },
    popupData: {
      deep: true,
      handler() {
        this.popupPanelData = this.popupData;
      }
    },
    position() {
      this.positionEntity = this.position;
    },
  },
  computed: {
    // 调整弹框位置
    styleObject() {
      return {
        position: "absolute",
        left: `${this.positionEntity.x}px`,
        top: `${this.positionEntity.y}px`
      };
    }
  },
  methods: {
    keyToChinese(key) {
      return this.keyMappings[key] || key;
    },
    // 删除标注
    deletePoint() {
      this.$emit('closePlotPop');
      this.$emit('wsSendPoint', JSON.stringify({ type: "point", operate: "delete", id: window.selectedEntity.id }));
    }
  }
};
</script>

<style>
.videoMonitorWin {
  position: absolute;
  height: 50vh;
  width: 650px;
  padding: 20px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
  border: 2px solid #18c9dc;
  overflow-y: auto;
}

.ponpTitle {
  text-align: center;
  font-size: 23px;
  color: white;
  margin-bottom: 10px;
}

.ponpTable {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: white;
}

.info-item {
  text-align: center;
  align-items:center;
  flex: 1 1 calc(50% - 10px); /* 两列布局，减去gap的宽度 */
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #293966;
  border: 1px solid #4d5469;
  border-radius: 4px;
}

.info-label {
  flex: 1;
  text-align: center;
  margin-right: 10px;
}

.info-value {
  flex: 1;
  text-align: center;
  /*background-color: #10344b;*/
}

el-button {
  display: block;
  margin: 20px auto 0;
}
</style>


<!--<template>-->
<!--  <div class="videoMonitorWin" v-if="visiblePanel" :style="styleObject">-->
<!--    <div class="ponpTitle">信息面板</div>-->
<!--    <table class="ponpTable">-->
<!--      <tbody style="height: 40vh; ">-->
<!--      <tr class="info-item">-->
<!--        <td>县（区）</td>-->
<!--        <td>{{this.popupPanelData.county}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>储备库点数量（个）</td>-->
<!--        <td>{{this.popupPanelData.storagePointsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>合计总件套数</td>-->
<!--        <td>{{this.popupPanelData.totalKitsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>救灾帐篷（顶）</td>-->
<!--        <td>{{this.popupPanelData.disasterTentsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>棉被（床）</td>-->
<!--        <td>{{this.popupPanelData.cottonBlanketsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>其他被子（床）</td>-->
<!--        <td>{{this.popupPanelData.otherBlanketsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>棉衣裤（套）</td>-->
<!--        <td>{{this.popupPanelData.cottonClothesCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>棉大衣（件）</td>-->
<!--        <td>{{this.popupPanelData.cottonCoatsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>其他衣物（套、件）</td>-->
<!--        <td>{{this.popupPanelData.otherClothesCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>毛毯（床）</td>-->
<!--        <td>{{this.popupPanelData.woolBlanketsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>折叠床（张）</td>-->
<!--        <td>{{this.popupPanelData.foldingBedsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>高低床（套）</td>-->
<!--        <td>{{this.popupPanelData.bunkBedsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>彩条布（包）</td>-->
<!--        <td>{{this.popupPanelData.stripedClothBundlesCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>防潮垫（张）</td>-->
<!--        <td>{{this.popupPanelData.moistureMatsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>发电机（台）</td>-->
<!--        <td>{{this.popupPanelData.generatorsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>照明灯具（个）</td>-->
<!--        <td>{{this.popupPanelData.lightingFixturesCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>照明灯组（套）</td>-->
<!--        <td>{{this.popupPanelData.lightingKitsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>手电筒（支）</td>-->
<!--        <td>{{this.popupPanelData.flashlightsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>雨衣（件）</td>-->
<!--        <td>{{this.popupPanelData.raincoatsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>雨靴（双）</td>-->
<!--        <td>{{this.popupPanelData.rainBootsCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>其他装备数量（个）</td>-->
<!--        <td>{{this.popupPanelData.otherSuppliesCount}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>地址</td>-->
<!--        <td>{{this.popupPanelData.address}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>经度</td>-->
<!--        <td>{{this.popupPanelData.lon}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>纬度</td>-->
<!--        <td>{{this.popupPanelData.lat}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>联系人</td>-->
<!--        <td>{{this.popupPanelData.contactPerson}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item">-->
<!--        <td>联系电话</td>-->
<!--        <td>{{this.popupPanelData.contactPhone}}</td>-->
<!--      </tr>-->
<!--      <tr class="info-item" >-->
<!--        <td>插入时间</td>-->
<!--        <td style="text-align: left;">{{this.popupPanelData.insertTime}}</td>-->
<!--      </tr>-->
<!--&lt;!&ndash;      <tr class="info-item" >&ndash;&gt;-->
<!--&lt;!&ndash;        <td>ID</td>&ndash;&gt;-->
<!--&lt;!&ndash;        <td style="text-align: left;">{{this.popupPanelData.id}}</td>&ndash;&gt;-->
<!--&lt;!&ndash;      </tr>&ndash;&gt;-->
<!--      </tbody>-->
<!--    </table>-->
<!--    <el-button  @click="deletePoint" type="danger" icon="el-icon-delete" circle></el-button>-->
<!--  </div>-->
<!--</template>-->
<!--<script>-->

<!--export default {-->
<!--  data(){-->
<!--    return{-->
<!--      visiblePanel:null,-->
<!--      positionEntity:{ x: 0, y: 0 },-->
<!--      popupPanelData:{},-->
<!--    }-->
<!--  },-->
<!--  props: [-->
<!--    'popupData','position','visible'-->
<!--  ],-->
<!--  watch:{-->
<!--    visible(){-->
<!--      this.visiblePanel = this.visible-->
<!--    },-->
<!--    popupData:{-->
<!--      deep:true,-->
<!--      handler(){-->
<!--        this.popupPanelData = this.popupData-->
<!--      }-->
<!--    },-->
<!--    position(){-->
<!--      this.positionEntity = this.position-->
<!--    },-->
<!--  },-->
<!--  computed: {-->
<!--    // 调整弹框位置-->
<!--    styleObject() {-->
<!--      return {-->
<!--        positionEntity: "absolute",-->
<!--        left: `${this.positionEntity.x}px`,-->
<!--        top: `${this.positionEntity.y}px`-->
<!--      };-->
<!--    }-->
<!--  },-->
<!--  methods:{-->
<!--    // 删除标注-->
<!--    deletePoint(){-->
<!--      this.$emit('closePlotPop')-->
<!--      this.$emit('wsSendPoint',JSON.stringify({type:"point",operate:"delete",id:window.selectedEntity.id}))-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
<!--<style >-->
<!--.videoMonitorWin{-->
<!--  position: absolute;-->
<!--  height: 50vh;-->
<!--  width: 600px;-->
<!--  padding: 20px;-->
<!--  z-index: 10;-->
<!--  background-color: rgba(40, 40, 40, 0.7);-->
<!--  border: 2px solid #18c9dc;-->
<!--}-->
<!--.ponpTitle{-->
<!--  font-size: 23px;-->
<!--  text-align: center;-->
<!--  color: white;-->
<!--  margin-bottom: 10px;-->
<!--}-->
<!--tbody {-->
<!--  height: 50vh;-->
<!--}-->
<!--.ponpTable{-->
<!--  text-align: center;-->
<!--  color: white;-->
<!--  margin-bottom: 10px;-->
<!--}-->
<!--.ponpTable td{-->
<!--  padding: 10px;-->
<!--}-->
<!--. info-item {-->
<!--  flex: 1 1 50%;-->
<!--}-->
<!--.info-item :nth-child(1){-->
<!--  width: 15%;-->
<!--  border-color:#293966;-->
<!--  border-top-style:solid;-->
<!--  border-top-width:2px;-->
<!--  background-color: #293966;-->
<!--  margin-bottom: 2px;-->
<!--  align-content: center;-->
<!--}-->
<!--.info-item :nth-child(2){-->
<!--  width: 40%;-->
<!--  border-color:#4d5469;-->
<!--  border-top-style:solid;-->
<!--  border-top-width:2px;-->
<!--  background-color: #4d5469;-->
<!--  margin-bottom: 2px;-->
<!--}-->

<!--</style>-->
