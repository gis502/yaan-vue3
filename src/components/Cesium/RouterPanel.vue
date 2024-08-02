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
      console.log(this.visiblePanel,234)
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

