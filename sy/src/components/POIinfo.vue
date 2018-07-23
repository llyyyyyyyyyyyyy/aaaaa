<template>
    <div>
        <div id="info">
            <div class="img-box">
                <img :src="InfoData.top_img+'-Newdeer11.1080'" alt="">
            </div>
            <h2>{{InfoData.name}}</h2>
            <h3><i v-for="n in InfoData.natureList" :key="n.id" >{{n.value}} </i></h3>
        </div>
        <main>
            <div class="title">
                <div class="k"></div>
                <h3>活动介绍</h3>
            </div>
            <div class="pSty"  >
                <p><span>印象：</span>{{InfoData.description150}}</p>
            </div>
            <div class="intrp pSty" ref="intrp">
                <p  ref="intrpInfo"><span>简介：</span>{{InfoData.guideIntro}}</p>
            </div>
            <div class="unfold" ref="unfold" @click="moreIntry" >查看更多</div>
            <div class="title">
                <div class="k"></div>
                <h3>实用信息</h3>
            </div>
            <div class="map">
                <div id="container"></div>
                <div class="shadow" @click="mapClick()"></div>
            </div>
            <div class="practical">
                <h4 v-if="InfoData.guideAddress">
                    <img src="../assets/img/地址 (1)@3x.png" alt="">
                    <span>地址</span>
                    <i>{{InfoData.guideAddress}}<a class="a" @click='init(InfoData)'>导航</a></i>
                    
                </h4>
                <h4 v-if="InfoData.guideTicket">
                    <img src="../assets/img/icon copy1@3x.png" alt="" >
                    <span>门票</span>
                    <i>{{InfoData.guideTicket}}</i>
                </h4>
                <h4 v-if="InfoData.guideOpenTime">
                    <img src="../assets/img/icon copy@3x.png" alt="">
                    <span>时间</span>
                    <i>{{InfoData.guideOpenTime}}</i>
                </h4>
                <h4 v-if="InfoData.guideTraffic">
                    <img src="../assets/img/交通 copy@3x.png" alt="">
                    <span>交通</span>
                    <i>{{InfoData.guideTraffic}}</i>
                </h4>
                <h4 v-if="InfoData.guideTips">
                    <img src="../assets/img/灯泡@3x.png" alt="">
                    <span>贴士</span>
                    <i>{{InfoData.guideTips}}</i>
                </h4>
                <h4 class="B" v-if="InfoData.guideWebsite">
                    <img src="../assets/img/网址@3x.png" alt="">
                    <span>网站</span>
                    <a href="InfoData.guideWebsite" class="b"><i>{{InfoData.guideWebsite}}</i></a>
                </h4>
                <h4 class="B" v-if="InfoData.guidePhone">
                    <img src="../assets/img/电话@3x.png" alt="">
                    <span>电话</span>
                    <i>{{InfoData.guidePhone}}</i>
                </h4>
            </div>
            <div class="title">
                <div class="k"></div>
                <h3>景点评论</h3>
                <router-link :to="{ name: 'comment', params:{ name: `${InfoData.name}`, id:InfoData.id } }">
                    写评论
                    <img src="../assets/img/笔 copy 6@3x.png" alt="">
                </router-link>
            </div>
            <div class="comment" v-for="(item,index) in comment" :key="item.id" v-if="index < commentNum">
                <h5>
                    <img :src="item.photo" alt="">
                    <span>{{item.nickName}}</span>
                    <i>{{item.createTime}}</i>
                </h5>
                <p class="cont">
                    {{item.commentDesp}}
                </p>
                <div class="imgBox">
                    <img class="pic" alt="" v-if="item.imgList" v-for="img in item.imgList" :key="img.id" :src="img.imgUrl+'-Newdeer11'">
                </div>
            </div>
            <router-link :to="{ name: 'comment', params:{ name: `${InfoData.name}`, id:InfoData.id } }">
                <h6 v-if="comment.length == 0">
                    还没有评论,快来抢沙发吧
                    <img src="../assets/img/PathCopy 4@3x.png" alt="">
                </h6>
            </router-link>
            <p class="more" @click="commentNum += 5" v-if="commentNum < comment.length">查看更多精彩评论   ></p>
            <div class="title">
                <div class="k"></div>
                <h3>附近景点</h3>
            </div>
            <div class="swiper-container near">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="n in nearData" :key="n.id">
                        <img :src='n.img+"-Newdeer11.500"'>
                        <p>{{n.name}}</p>
                        <span>距离{{(n.distance/1000000).toFixed(1)}}km</span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import { Indicator } from 'mint-ui'
import AMap from 'AMap'
export default {
    data(){
        return{
            InfoData:[],
            //评论列表
            comment:[],
            commentNum: 3,
            origin:'',
            nearData:[]
        }
    },
    props:['id'],
    created(){
        console.log(this.$refs.intrpInfo)
    //    document.documentElement.scrollTop = '0'
    },
    methods: {
         mapClick(){
             this.$router.push({path:'/maplist/'+this.id})
         },
        init (obj){
            var _this = this
            let mapObj = new AMap.Map('iCenter');
            mapObj.plugin('AMap.Geolocation', function () {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                mapObj.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', function(data,a,b){
                    _this.origin = [data.position.lng,data.position.lat]
                   

                    _this.navigat(obj)
                });//返回定位信息
                AMap.event.addListener(geolocation, 'error', function(error){
                    console.log(error)
                    // alert(error)
                });      //返回定位出错信息

            });
        },
        navigat(data){
            var _this = this;
            var destination = [data.longitude.toFixed(6),data.latitude.toFixed(6)]
            console.log(destination)
            let map_a = new AMap.Map("mapContainer");
            AMap.plugin(["AMap.Driving"], function() {
                var drivingOption = {
                    policy:AMap.DrivingPolicy.LEAST_TIME,
                    map:map_a
                };
                var driving = new AMap.Driving(drivingOption); //构造驾车导航类
                //根据起终点坐标规划驾车路线
                // driving.search([{keyword:'北京站'},{keyword:'北京大学'}],function(status,result){
                driving.searchOnAMAP({
                    origin:_this.origin,
                    destination:destination
                });
                // });
                
            });
            map_a.addControl(new AMap.ToolBar());
        },
        initSwiper(){
            let that = this
            this.mySwiper = new Swiper('.swiper-container', {
            resistanceRatio:0.5,
            spaceBetween : 8,
            observer:true,
            slidesPerView :'auto'
            })
            setTimeout(()=>{
                document.getElementsByClassName('swiper-wrapper')[0].style.transform="translate3d(0px,0px,0px)"
            },100)
        },
        loadmap(mapData){
            let map = new AMap.Map('container', {
            dragEnable:  false ,
            zoomEnable:false,
            zoom: 13,
            center: [mapData.longitude,mapData.latitude]
            });
            let icon = new AMap.Icon({
                size: new AMap.Size(30, 30),   // 图标尺寸
                image: mapData.icon == 'human'? require('../assets/img/人文@3x.png'): require('../assets/img/自然@3x.png'),  // Icon的图像
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
        //获取页面信息
        getInfo(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:83/scenic_spots/guide',{
                params:{token:tool.token(),id:this.id
                }}).then(res=>{
                    this.loadmap(res.data.data.ss)
                    this.InfoData = res.data.data.ss
                    this.initSwiper()
                    this.getComment()
                    this.getNear()
                })
                // Indicator.close()
        },
        //获取评论
        getComment(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:84/comment/list?itemId='+this.$route.params.id+'&isCream=2&qType=all&start=0&limit=1000&token='+tool.token()).then(res=>{
                    this.comment = res.data.data.list;
                   
            })
        },
        //获取附近景点
        getNear(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:83/scenic_spots/listNearbyss',{
                params:{lat:this.InfoData.longitude,lon:this.InfoData.latitude,ssId:536}
            }).then(res=>{
                this.nearData = res.data.data.list
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
h6{
    text-align: center;
    font-size: 0.14rem;
    font-weight: 900;
    margin-top:0.2rem;
    color: #848484;
    display: flex;
    height: 0.24rem;
    justify-content:center;
    line-height: 0.24rem;
    img{
        height: 0.1rem;
        width: 0.06rem;
        margin: 0.06rem 0 0 0.06rem
    }
}
#info{
    width: 3.27rem;
    margin: 0.34rem auto 0.3rem;
    overflow: hidden;
}
.img-box{
        height: 3.27rem;
        width: 3.27rem;
        overflow: hidden;
        margin-bottom: 0.15rem;
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
    margin-top:0.04rem;
}
main{
    width: 3.33rem;
    margin: 0 auto;
}
main .title{
    margin-top: .3rem;
    line-height: 0.24rem;
    margin-bottom: 0.12rem;
    position: relative;
    img{
        height: 0.12rem;
        width: 0.12rem;
        float: right;
        padding:0.06rem 0 0 0.06rem;
    }
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
    margin: 0.16rem 0 0 0;  
    width: 3.33rem;
    height: 0.46rem;
    position: relative;
    overflow: hidden;
}
main .unfold{
    float: right;
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
    font-size: 0.14rem
}
.practical  h4 img{
    padding-top: 0.04rem;
    vertical-align:middle;
    width: 0.14rem;
    height: 0.14rem;
    float: left;
}
.practical  h4 span{
    float: left;
    top:0;
    margin:0 0.12rem;
}
.practical  h4 i{
    display: inline-block;
    max-width: 2.62rem;
    min-height: 0.21rem;
}
.practical  h4 .a{
    height: 0.16rem;
    color: #119DFF;
    position: absolute;
    right: .3rem;
    border: 1px solid #119DFF;
    border-radius: 2px;
    padding: 0 0.08rem;
    line-height: 0.16rem;
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
    margin-top:0.08rem;
    word-wrap:break-word;
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
    .contImg{
        width: 1.20rem;
    }
    img{
        width: 1.20rem;
        height: 1.20rem;
    }
    .name{
        font-weight: 900;
    }
    .swiper-slide{
        width: 1.2rem !important
    }
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
