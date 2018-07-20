<template>
  <div id="maplist">
      <!-- <header @click="hclick()"></header> -->
    <img class="logo" src="../assets/img/logo@3x.png" alt="">
    <div id="container" class="mymap"></div>
    <footer>
        <div class="button" @click="toList">
            <img src="../assets/img/Shape@3x.png" alt=""> 切换列表
        </div>
      
            <div class="swiperBox">
                <transition leave-active-class="animated  fadeOutDown" enter-active-class="animated fadeInUp">
                <div class="swiper-container" v-show="swShow" >                
                    <div class="swiper-wrapper" >
                        <div class="swiper-slide" v-for="n in this.swiperData" :key="n.id" @click="toInfo(n.id)">
                            <img class="city" :src="n.cover_img" alt="" >
                            <img class="shadow" src="../assets/img/Rectangle@3x.png" alt="" >
                            <h4>{{n.name}}</h4>
                        </div>
                    </div>
                </div>
                </transition>
            </div>
         
    </footer>
  </div>
  
</template>
<script>
import Swiper from 'swiper'
import AMap from 'AMap'
import { Indicator } from 'mint-ui';
export default {
    data (){
        return{
            swiperData:[],
            BMap:[],
            center:[],
            InfoWindow:[],
            swShow:false,
            area:[]
    }},
    beforeMount(){
        this.getData()
        // this.loadmap()
        let that = this
        setTimeout(()=>{that.BMap.setZoom(10)},1000)
    },
    methods: {
        toInfo(id){
            console.log(id)
            this.$router.push({path:'/poiinfo/'+id})
            
        },
        initSwiper(){
            let that = this
            this.mySwiper = new Swiper('.swiper-container', {
            resistanceRatio:0.5,
            spaceBetween : 12,
            observer:true,
            slidesPerView: 1,
            observeParents:true,
            onSlideChangeEnd() {
                that.BMap.setZoom(13)
                that.BMap.setCenter(that.center[that.mySwiper.activeIndex])
                that.infoWindow.open(that.BMap,that.center[that.mySwiper.activeIndex])
                that.infoWindow.setContent(that.BMap.getAllOverlays('marker')[that.mySwiper.activeIndex].content)
                },
            // onTransitionEnd() {
            //     that.BMap.setZoom(13)
            //     that.BMap.setCenter(that.center[that.mySwiper.activeIndex])
            //     that.infoWindow.open(that.BMap,that.center[that.mySwiper.activeIndex])
            //     that.infoWindow.setContent(that.BMap.getAllOverlays('marker')[that.mySwiper.activeIndex].content)
            //     }
            })
            
        },
        //获取数据
        getData(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:83/plan/sslist',{
                params:{cursor:1,limit:100,regionIds:546
                }}).then(res=>{
                // console.log(res.data.data.regionDetail[0].ssList)
                this.initSwiper()
                this.loadmap(res.data.data.regionDetail[0].ssList)
                this.swiperData =  res.data.data.regionDetail[0].ssList
                //绑定点击地图 swiper消失
                this.BMap.on('click',()=>{if(this.infoWindow.getIsOpen()){
                    this.swShow = !this.swShow
                }})
                this.area = this.BMap.getBounds()
                this.BMap.setLimitBounds(this.area)
            })
        },
        //跳转列表页
        toList(){
            this.$router.push({path:'/poilist'})
        },
        //地图实例化
        loadmap(mapData){
        let that = this
        that.BMap = new AMap.Map('container', {
            zoom: 10,
            zooms:[10,19],
            center: [116.718463,40.132709],
            resizeEnable: true
        });
        that.BMap.setMapStyle('amap://styles/'+'whitesmoke');
        AMapUI.load(['ui/geo/DistrictExplorer'], function(DistrictExplorer) {
        //创建一个实例
        let districtExplorer  = new DistrictExplorer({
            map: that.BMap
        });
      
        initPage(DistrictExplorer);
        //获取北京数据
        loadAreaNode(110000, function(error, areaNode) {
            //移除顺义区的坐标集
            areaNode._data.geoData.sub.features[9].geometry.coordinates = []
            areaNode._data.geoData.sub.features[2].geometry.coordinates[1] = []
            renderAreaPolygons(areaNode)
        });
        //绘制某个区域的边界
        function renderAreaPolygons(areaNode) {
            //绘制子区域
            districtExplorer.renderSubFeatures(areaNode, function(feature) {
                    return {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: "#ccc", //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: "#ddd", //填充色
                    fillOpacity: 0.5, //填充透明度
                };
            });
        }
        //加载区域
        function loadAreaNode(adcode, callback) {
            districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
                if (callback) {
                    callback(null, areaNode);
                }
            });
        }
        function getAllRings(feature) {
            let coords = feature.geometry.coordinates,
                rings = [];
            for (let i = 0, len = coords.length; i < len; i++) {
                rings.push(coords[i][0]);
            }
            return rings;
        }
        function getLongestRing(feature) {
            let rings = getAllRings(feature);
            rings.sort(function(a, b) {
                return b.length - a.length;
            });
            return rings[0];
        }

    //点击出来的信息窗体 
        that.infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(-4, 4),
            closeWhenClickMap:true,
            isCustom:true
        });
        console.log(mapData)
        for (let i = 0 ; i < mapData.length; i++) {
            that.center.push([mapData[i].longitude,mapData[i].latitude])
            let marker = new AMap.Marker({
                position: [mapData[i].longitude,mapData[i].latitude],
                map: that.BMap,
                icon:new AMap.Icon({            
                    image: require('../assets/img/Oval 3@3x.png'),
                    imageSize: new AMap.Size(10,10),
                }) 
            });
            marker.content = `<div class="mMarker">
                                    <img src=${require('../assets/img/人文@3x.png')}>
                                    <i>${mapData[i].name}</i>
                                </div>`;
            marker.on('click', function (e) {
                that.mySwiper.slideTo(i)
                that.swShow = true
                that.infoWindow.setContent(e.target.content);
                // that.infoWindow.open(that.BMap, e.target.getPosition());   
                that.BMap.setCenter([mapData[i].longitude,mapData[i].latitude])
                that.BMap.setZoom(13)
                // console.log(that.infoWindow.getIsOpen())
                if(!that.infoWindow.getIsOpen()){
                    that.infoWindow.open(that.BMap, e.target.getPosition());
                    // that.infoWindow.setContent(e.target.content);
                }
            });
        }
    
        that.BMap.setFitView();
        function initPage(DistrictExplorer) {
            //创建一个实例
            let districtExplorer = new DistrictExplorer({
                map: that.BMap
            }); 
                  
            districtExplorer.loadMultiAreaNodes(
                //只需加载全国和市，全国的节点包含省级
                [100000].concat(110000),
                function(error, areaNodes) {              
                    let countryNode = areaNodes[0],
                        cityNodes = areaNodes.slice(1);
                    let path = [];
                    //首先放置背景区域，这里是大陆的边界
                    path.push(getLongestRing(countryNode.getParentFeature()));            
                        //逐个放置需要镂空的市级区域
                    path.push.apply(path, getAllRings(cityNodes[0].getParentFeature()));
                    //绘制带环多边形
                    let polygon = new AMap.Polygon({
                        bubble: true,
                        lineJoin: 'round',
                        strokeColor: '#ccc', //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 1, //线宽
                        fillColor: '#ddd', //填充色
                        fillOpacity: 0.5, //填充透明度
                        map: that.BMap,
                        path: path
                    });
            });
        }
        }); 
        }
    }
}
</script>


<style lang="scss" scoped>
header{
    height: 0.44rem;
}
.logo{
    position: fixed;
    top: 0.12rem;
    left: 0.12rem;
    height: 1.15rem;
    width: 1.15rem;
    z-index: 200;
}
 .swiperBox{
        width: 3.75rem;
        z-index: 300;
        .swiper-wrapper{
            margin-left:0.24rem;
            width: 3.27rem;
        }
        .swiper-slide{
            color: #fff;
            height: 1.5rem;
            position: relative;
            .city{
                width: 3.27rem;
                height: 1.5rem;
            }
            h4{
                position: absolute;
                bottom: 0.15rem;
                left:0.2rem
            }
            .shadow{
                height: 1.1rem;
                width: 3.27rem;
                position: absolute;
                bottom:0
            }
        }    
    }
#maplist{
    height: 6.67rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 10;
    position: relative;
}
footer{
    position: fixed;
    bottom: 0.25rem;
    z-index: 200;
}
#maplist .button{
    background:#fff;
    position: relative;
    width: 1.1rem;
    height: 0.33rem;
    text-align: center;
    line-height: 0.33rem;
    color: #5F5F5F;
    border-radius: 0.165rem;
    padding-left: 0.23rem;
    box-sizing: border-box;
    margin:0 0 0.15rem 1.33rem;
    img{
        height: 0.11rem;
        width: 0.13rem;
        position: absolute;
        top:0.11rem;
        left:0.14rem;
    }
}

</style>
<style lang="scss">
.mMarker{
    background:#EAC454;
    padding:0 0.12rem 0 0;
    border:1px solid #fff;
    border-radius: 0.17rem;
    height: 0.34rem;
    max-width: 1.19rem;
    display: flex;
    overflow: hidden;
    align-items:center;
        img{
            height: 0.34rem;
            width: 0.33rem;
            display: inline;
        }
        i{
            display:flex;
            font-size:0.1rem;
            color:#fff;
        } 
}

</style>
