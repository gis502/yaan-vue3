<template>
  <div class="videoMonitorWin" v-if="visiblePanel" :style="styleObject">
    <div class="ponpTitle">{{ this.popupTitle }}</div>
    <div class="ponpTable">
      <div class="info-item" v-for="(value, key) in popupPanelData" :key="key">
        <div class="info-label">{{ keyToChinese(key)  }}</div>
        <div class="info-value">
          <!-- 如果键是插入时间，则格式化显示 -->
          <span v-if="key === keyMappings.insertTime">{{ formatInsertTime(value) }}</span>
          <span v-else>{{ value }}</span>
        </div>
      </div>
    </div>
    <!-- 取消注释按钮以启用删除功能 -->
    <!-- <el-button @click="deletePoint" type="danger" icon="el-icon-delete" circle></el-button> -->
  </div>
</template>

<script>

import { toRaw } from 'vue'
import dayjs from 'dayjs'; // 引入dayjs库进行时间格式化

export default {
  data() {
    return {
      visiblePanel: null,
      positionEntity: { x: 0, y: 0 },
      popupPanelData: {},
      popupTitle: '',
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
          totalItems: '合计总件套数',
          infraredDetectors: '红外探测仪',
          opticalDetectors: '光学探测仪(蛇眼)',
          hydraulicSpreaders: '液压扩张钳',
          hydraulicCutters: '液压剪切钳',
          rockDrills: '凿岩机',
          crowbars: '撬棍（把）',
          rebarCutters: '钢筋速断器',
          hydraulicJacks: '手动液压千斤顶',
          lightSticks: '发光棒',
          fuelLiters: '油料（升）',
          tensileRopeMeters: '抗拉索',
          rescueRopesMeters: '救援绳（米）',
          ropeThrowers: '抛绳器',
          foldingLadders: '折叠梯（个）',
          shovelsPicksHooksForksHammers: '锹/镐/钩/叉/锤',
          foldingShovels: '折叠铲（把）',
          whistles: '口哨（个）',
          helmets: '头盔（顶）',
          rainBoots: '雨鞋（双）',
          gloves: '手套（双）',
          lifelinesMeters: '救生缆索（米）',
          drainagePumps: '排水泵（台）',
          fireBlowers: '风力灭火机（个）',
          ironShovels: '铁锹（把）',
          lifeJackets: '救生衣（件）',
          lifeRings: '救生圈（个）',
          warningTapesMeters: '警示带（米）',
          walkieTalkies: '对讲机（台）',
          megaphones: '扩音器（个）',
          gongs: '锣（个）',
          headlamps: '头灯（个）',
          portableLights: '手提照明灯（个）',
          medicalKits: '医疗急救箱',
          excavators: '挖掘机',
          loaders: '装载机（推土机）',
          waterPumps: '抽水泵',
          relayPumps: '接力水泵',
          mobileWaterBags: '移动水囊（个）',
          backpackFireSprayers: '背负式喷水灭火抢',
          chainsaws: '油锯（个）',
          hosesMeters: '水带（米）',
          fireTrucks: '消防水车',
          otherSupplies: '其他',
      },
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
        // 转换 popupData,避免嵌套Proxy
        const rawPopupData = toRaw(this.popupData);
        console.log(rawPopupData, 'data----');
        // 获取 popupTitle表头
        this.popupTitle = rawPopupData.tableName;
        console.log(this.popupTitle, 'title----');

        // 将 key 转换为中文
        const translatedData = {};
        for (const key in rawPopupData) {
          if (rawPopupData.hasOwnProperty(key) && key !== 'tableName' && key !== 'id') {
            const translatedKey = this.keyMappings[key] || key;
            translatedData[translatedKey] = rawPopupData[key];
          }
        }
        this.popupPanelData = translatedData;

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
    },
  },
  methods: {
    keyToChinese(key) {
      return this.keyMappings[key] || key;
    },
    formatInsertTime(value) {
      // 使用dayjs库进行时间格式转换
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    },
    // 删除标注
    deletePoint() {
      this.$emit('closePlotPop');
      this.$emit('wsSendPoint', JSON.stringify({ type: "point", operate: "delete", id: window.selectedEntity.id }));
    }
  }
};
</script>

<style scoped>
.videoMonitorWin {
  position: absolute;
  height: 50vh;
  width: 700px;
  padding: 20px;
  z-index: 10;
  background-color: rgba(40, 40, 40, 0.7);
  /*border: 2px solid #18c9dc;*/
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
  color: white;
}

.info-item {
  font-size: 15px;
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
