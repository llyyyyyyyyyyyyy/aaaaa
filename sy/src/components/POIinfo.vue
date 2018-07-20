<template>
    <div class="poiinfo">
        <div id="info">
<<<<<<< HEAD
            <div class="swiperBox">
                <div class="swiper-container">                
                    <div class="swiper-wrapper" >
                        <div class="swiper-slide" :key="InfoData.id">
                            <img class="city" :src="InfoData.cover_img" alt="" >
                        </div>
                    </div>
                </div>
=======
            <div class="img-box">
                <img :src="InfoData.top_img" alt="">
>>>>>>> master
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
                <div class="shadow" @click="mapClick()"></div>
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
                    <i>{{InfoData.guideOpenTime}}</i>
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
                    <i>{{InfoData.guideWebsite}}</i>
                </h4>
                <h4 class="B">
                    <img src="../assets/img/电话@3x.png" alt="">
                    <span>电话</span>
                    <i>{{InfoData.guidePhone}}</i>
                </h4>
            </div>
            <div class="title">
                <div class="k"></div>
                <h3>景点评论</h3>
                <router-link :to="{ name: 'comment', params:{ name: `${InfoData.name}`, id:InfoData.id } }">写评论</router-link>
            </div>
<<<<<<< HEAD
            <div class="comment" v-for="(item,index) in comment" :key="item.id" v-if="index < commentNum">
                <h5>
                    <img :src="item.photo" alt="">
                    <span>{{item.nickName}}</span>
                    <i>{{item.createTime}}</i>
                </h5>
                <p class=".cont">
                    {{item.commentDesp}}
                </p>
                <div class="imgBox">
                    <img class="pic" alt="" v-if="item.imgList" v-for="img in item.imgList" :key="img.id" :src="img.imgUrl">
                </div>
            </div>
            <p class="more" @click="commentNum += 10" v-if="commentNum < comment.length">查看全部精彩评论   ></p>
=======
            <div class="commentBox">
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
            </div>
>>>>>>> master
            <div class="title">
                <div class="k"></div>
                <h3>附近景点</h3>
            </div>
            <div class="swiper-container near">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <img src="n.img">
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
            InfoData:[],
            //评论列表
            comment:[],
            commentNum: 10,
        }
    },
    props:['id'],
    created(){
        document.body.scrollTop = '0';
    },
    methods: {
         mapClick(){
             console.log(this.id)
             this.$router.push({path:'/maplist/'+this.id})
         },
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
                params:{token:tool.token(),id:this.id
                }}).then(res=>{
<<<<<<< HEAD
                    console.log(res.data.data.ss)
                    this.loadmap(res.data.data.ss)
                    console.log(this.id)
                    this.InfoData = res.data.data.ss
                    this.initSwiper()
                    this.getComment()
                })
        },
        getComment(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:84/comment/list?itemId='+this.$route.params.id+'&isCream=2&qType=all&start=0&limit=1000&token='+tool.token(),).then(res=>{
                    console.log(res.data.data)
                    this.comment = res.data.data.list;
=======
                this.loadmap(res.data.data.ss)
                // console.log(this.id)
                this.InfoData = res.data.data.ss
                this.initSwiper()
>>>>>>> master
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
    console.log(document.body.scrollTop);
    },
    
}
</script>
<style lang='scss' scoped>
#info{
    width: 3.27rem;
    margin: 0.34rem auto 0.3rem;
    overflow: hidden;
}
.img-box{
        height: 3.27rem;
        width: 3.27rem;
        overflow: hidden;
            img{
                width: 3.27rem;
                height: 3.27rem;
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
    margin-top: .5rem;
    line-height: 0.24rem;
    margin-bottom: 0.12rem;
    position: relative;
}
main .title .k{
    width: 0.03rem;
    height: 0.12rem;
    background: #119DFF;
    display: inline-block;
}
main .title a{
    color: #119DFF;
    position: absolute;
    right: 0;
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
.comment .imgBox{
    width: 2.85rem;
    display: flex;
    flex-wrap: wrap;
}
.comment .imgBox img{
    width: .8rem;
    height: .8rem;
    margin: .05rem;
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
    margin:0 0 0.4rem 0.48rem;
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
    width: 3.27rem;
    position: relative;
    .shadow{
        height: 1.09rem;
        width: 3.27rem;
        position: absolute;
        top:0;
        z-index: 300;
    }
}
</style>
