<template>
    <div class="poiinfo">
        <div id="info">
            <div class="swiperBox">
                <div class="swiper-container">                
                    <div class="swiper-wrapper" >
                        <div class="swiper-slide" v-for="(n,i) in this.InfoData.top_img" :key="n.id">
                            <img class="city" :src="n" alt="" >
                            {{i}}
                        </div>
                    </div
                    >
                </div>
            </div>
            <h2>{{InfoData.name}}</h2>
            <h3>公园 · 绿地</h3>
        </div>
        <main>
            <div class="title">
                <div class="k"></div>
                <h3>活动介绍</h3>
            </div>
            <div class="pSty">
                <p><span>印象：</span>{{InfoData.description150}}</p>
            </div>
            <div class="intrp pSty" ref="intrp">
                <p ><span>简介:</span>{{InfoData.guideIntro}}...</p>
                <div class="unfold" ref="unfold" @click="moreIntry">查看更多</div>
            </div>
            <div class="title">
                <div class="k"></div>
                <h3>实用信息</h3>
            </div>
            <div class="map">
                <div id="container"></div>
            </div>
            <div class="practical">
                <h4>
                    <img src="../assets/img/地址 (1)@3x.png" alt="">
                    <span>地址</span>
                    <i>{{InfoData.guideAddress}}</i>
                </h4>
                <h4>
                    <img src="../assets/img/icon copy1@3x.png" alt="" >
                    <span>门票</span>
                    <i>{{InfoData.guideTicket}}</i>
                </h4>
                <h4>
                    <img src="../assets/img/icon copy@3x.png" alt="">
                    <span>时间</span>
                    <i>{{InfoData.guideBestTime}}</i>
                </h4>
                <h4>
                    <img src="../assets/img/交通 copy@3x.png" alt="">
                    <span>交通</span>
                    <i>{{InfoData.guideTraffic}}</i>
                </h4>
                <h4>
                    <img src="../assets/img/灯泡@3x.png" alt="">
                    <span>贴士</span>
                    <i>{{InfoData.guideTips}}</i>
                </h4>
                <h4 class="B">
                    <img src="../assets/img/网址@3x.png" alt="">
                    <span>网站</span>
                    <i>http://www.sclgh.cn</i>
                </h4>
                <h4 class="B">
                    <img src="../assets/img/电话@3x.png" alt="">
                    <span>电话</span>
                    <i>0834-6390322；0834-6390302</i>
                </h4>
            </div>
            <div class="title">
                <div class="k"></div>
                <h3>景点评论</h3>
            </div>
            <div class="comment">
                <h5>
                    <img src="" alt="">
                    <span>aimee叮叮叮</span>
                    <i>2017-04-10</i>
                </h5>
                <p class=".cont">
                    很美很美！即使已经离开数天，泸沽湖的美还深深印刻在我的脑海里！洱海的美不及泸沽湖之万一。希望在以后有机会能够呆上一周甚至更长时间
                </p>
                <img class="pic" alt="" src="">
            </div>
            <p class="more">查看全部精彩评论   ></p>
            <div class="title">
                <div class="k"></div>
                <h3>附近景点</h3>
            </div>
            <div class="swiper-container near">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <img src="n.img ">
                        <p>玉湖村</p>
                        <span>距离12.8km</span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import AMap from 'AMap'
export default {
    data(){
        return{
            InfoData:[]
        }
    },
    props:['id'],
     methods: {
         initSwiper(){
            let that = this
            this.mySwiper = new Swiper('.swiper-container', {
            resistanceRatio:0.5,
            spaceBetween : 0,
            observer:true,
            slidesPerView: 1,
            })},
        loadmap(mapData){
            let map = new AMap.Map('container', {
            dragEnable:  false ,
            zoomEnable:false,
            zoom: 13,
            center: [mapData.longitude,mapData.latitude]
            });
            let icon = new AMap.Icon({
                size: new AMap.Size(30, 30),   // 图标尺寸
                image:  require('../assets/img/人文@3x.png'),  // Icon的图像
                imageSize: new AMap.Size(30,30)   // 根据所设置的大小拉伸或压缩图片
            });
            let marker = new AMap.Marker({
                position: [mapData.longitude,mapData.latitude], 
                icon: icon,
                offset: new AMap.Pixel(-10, -10)
            });
            map.add(marker);
            map.setMapStyle('amap://styles/'+'whitesmoke');
        },
        getInfo(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:83/scenic_spots/guide',{
                params:{token:'e288cdc4355f3704f8efaef76347b3df',id:this.id
                }}).then(res=>{
                this.loadmap(res.data.data.ss)
                console.log(this.id)
                this.InfoData = res.data.data.ss
                this.initSwiper()
            })
        },
         //展开内容
        moreIntry () {
            if(this.$refs.unfold.innerHTML =='查看更多'){
                this.$refs.intrp.style.height = 'auto'
                this.$refs.unfold.innerHTML ='收起内容'}
            else{
                this.$refs.intrp.style.height = '0.46rem'
                this.$refs.unfold.innerHTML ='查看更多'
            }
        },
    },
    mounted(){
    this.getInfo()

    },
    
}
</script>
<style lang='scss' scoped>
#info{
    width: 3.27rem;
    margin: 0.34rem auto 0.3rem;
    overflow: hidden;
}
.swiperBox{
        height: 3.27rem;
        width: 3.27rem;
        overflow: hidden;
        .swiper-wrapper{
            width: 3.27rem;
        }
        .swiper-slide{
            color: #fff;
            height: 3.27rem;
            background: #ccc;
            position: relative;
            border-radius: 0.04rem;
            img{
                width: 3.27rem;
                height: 3.27rem;
            }
            h4{
                position: absolute;
                bottom: 0.15rem;
                left:0.2rem
            }
        }    
    }
#info h2{
    color: #484848;
    font-size:0.24rem;
    line-height: 0.33rem;
    font-weight: 900;
}
#info h3{
    font-size: 0.12rem;
    color: #3F3F3F;
    line-height: 0.17rem;
    margin: 0.04rem 0 0.06rem;
}
main{
    width: 3.33rem;
    margin: 0 auto;
}
main .title{
    line-height: 0.24rem;
    margin-bottom: 0.12rem;
}
main .title .k{
    width: 0.03rem;
    height: 0.12rem;
    background: #119DFF;
    display: inline-block;
}
main .title h3{
    display: inline-block;
    margin-left:0.12rem;
    font-size: 0.17rem;
    font-weight: 900;
}
main .pSty  p{
    font-size: 0.15rem;
    line-height: 0.24rem;
}
main .pSty p span{
    color: #119DFF
}
main .intrp{
    margin: 0.16rem 0 0.4rem; 
    width: 3.33rem;
    height: 0.46rem;
    position: relative;
    overflow: hidden;
}
main .intrp .unfold{
    position: absolute;
    bottom:0rem;
    left: 2.75rem;
    color: #119DFF;
    font-size: 0.14rem;
    background: #fff;
    z-index: 99;
}
.practical{
    margin-bottom: 0.16rem;
}
.practical  h4{
    margin-top:0.3rem;
    line-height: 0.21rem;
}
.practical  h4 img{
    padding-top: 0.04rem;
    /* display: inline-block; */
    vertical-align:middle;
    width: 0.14rem;
    height: 0.14rem;
    float: left;
}
.practical  h4 span{
    /* display: inline-block; */
    float: left;
    top:0;
    margin:0 0.12rem;
}
.practical  h4 i{
    display: inline-block;
    max-width: 2.62rem;
    min-height: 0.21rem;
}
.practical .B i{
    color: #119DFF
}
.comment{
    font-size:0.15rem;
    line-height: 0.21rem;
    color: #484848;
    margin:0.36rem 0 0  0.48rem;
}
.comment h5 img{
    margin-left: -0.48rem;
    height: 0.4rem;
    width: 0.4rem;
    border-radius: 0.2rem;
    /* display: inline-block; */
    float: left;
    margin-right: 0.08rem;
}
.comment h5 span{
    display: inline-block;
    width: 2.5rem;
    font-weight: 900;
}
.comment h5 i{
    display: inline-block;
    font-size: 0.12rem;
    line-height: 0.17rem;
}
.comment .cont{
    width: 2.79rem;
    height: 0.84rem;
    margin-top:0.08rem;
}
.more{
    color: #119DFF;
    font-size: 0.14rem;
    line-height: 0.24rem;
    margin:0.33rem 0 0.4rem 0.48rem;
}
.near{
    height: 2rem;
    color: #484848;
} 
.near img{
    width: 1.2rem;
    height: 1.2rem;
}
.near p{
    font-weight: 900;
    font-size: 0.15rem;
    margin: 0.08rem 0 0.02rem;
    line-height: 0.21rem;
}
.near span{
    font-size: 0.13rem;
}
.map{
    height: 1.09rem;
    width: 3.27rem
}
</style>
