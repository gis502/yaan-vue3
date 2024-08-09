<template>
    <div id="news">
        <h2 class="sub-title">
            最新事件:
<!--            <span class="m-time">{{ speakers.time }}</span>-->
        </h2>
        <div class="sub-main">
            <ul class="sub-ul">
                <li
                        :class="[i === 0 || i === 1 ? 'high' : '']"
                        v-for="(item, i) in newsData"
                        :key="item.uuid"
                        style="cursor: pointer"
                >
                    <!--                <div class="img" v-if="item.logo">-->
                    <!--                    <img :src="getOssImageByKey(item.logo)" alt=""/>-->
                    <!--                </div>-->
                    <!--                <div class="img" v-else-if="item.img">-->
                    <!--                    <img :src="getOssImageByKey(item.img)" alt=""/>-->
                    <!--                </div>-->
                    <!--                <div class="img" v-else>-->
                    <!--                    <img src="@/assets/logo.jpeg" alt=""/>-->
                    <!--                </div>-->
                    <div class="sub-content">
                        <p class="sub-time">{{ item.publish_time }}</p>
                        <p class="sub-text">{{ item.content }}</p>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import newsData from "@/assets/json/TimeLine/news.json"

    export default {
        name: "news",
        data(){
            return{
                newsData: newsData,
            }
        },
        mounted() {
            this.fetchData()
        },
        methods:{
            async fetchData() {
                this.newsData = this.newsData.filter((item,index) => index < 5)
                console.log("----",this.newsData[0].publish_time)
            },
        }
    }
</script>

<style scoped>
    #news {
        width: 180px;
        height: 300px;
        position: absolute;
        padding: 0 5px 5px;
        border-radius: 5px;
        top: 80px;
        right: 10px;
        z-index: 100; /* 更高的层级 */
        background-color: rgba(40, 40, 40, 0.7);
        color: white;
    }
    .sub-title {
        font-family: myFirstFont;
        font-size: .8rem;
        line-height: 1.8rem;
        /*padding: 1rem 0 1rem !important;*/
        color: #ffffff;
        letter-spacing: 0;
        text-align: justify;
        text-shadow: 0.2rem 0.3rem 0 rgba(0, 0, 0, 0.39);
        border-bottom: 0.1rem solid #ffffff;
        margin: 0;
        padding: 0;
    }
    .sub-main{
        margin-top: 5px;
        max-height: 260px;
        overflow-y: auto;
    }
    .sub-ul{
        padding: 0;
        margin: 0;
        font-size: .7rem;
        line-height: 1.8rem;
        overflow-y: auto; /* 当内容超出时显示垂直滚动条 */
        list-style-type: none; /* 去除列表项默认的项目符号 */
    }
    .sub-content{
        padding: 0;
        margin: 0;
        line-height: .9rem;
    }
    .sub-time{
        padding: 0;
        line-height: .2rem
    }
    .sub-text{
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 显示前两行 */
        -webkit-box-orient: vertical;
        overflow: hidden; /* 隐藏超出部分 */
        text-overflow: ellipsis; /* 超出部分用省略号表示 */
        line-height: 1.4; /* 行高，调整以适应你的字体 */
        height: 2.8em; /* 高度设置为两行的高度 */
    }
</style>
