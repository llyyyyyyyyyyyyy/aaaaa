<template>
  <div id="maplist">
      <!-- <header @click="hclick()"></header> -->
    <img class="logo" src="../assets/img/logo@3x.png" alt="">
    <div id="container" class="mymap"></div>
  </div>
  
</template>
<script>
import AMap from 'AMap'
export default {
    data (){
        return{
            BMap:[],
            center:[],
            InfoWindow:[],
            area:[],
            zoom:[],
            num:[]
    }},
    props:['id'],
    beforeMount(){
        this.getData()
        setTimeout(()=>{this.infoWindow.open(this.BMap,this.center[this.num])},500) 
    },
    methods: {
        //获取数据
        getData(){
            this.$http.get('http://dev.shunyi.mydeertrip.com:83/plan/sslist',{
                params:{cursor:1,limit:100,regionIds:546
                }}).then(res=>{
                this.loadmap(res.data.data.regionDetail[0].ssList)
                this.area = this.BMap.getBounds()
                this.BMap.setLimitBounds(this.area)
                
            })
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
            that.zoom = that.BMap.getZoom()
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
                isCustom:true,
                autoMove:true,
            });
            console.log(mapData)
            //加载对应信息窗体
            for ( let i = 0; i < mapData.length;i++){
                if(mapData[i].id == that.id){
                    that.num = i
                    that.infoWindow.open(that.BMap,that.center[i])
                    // that.infoWindow.setContent(that.BMap.getAllOverlays('marker')[i].content)
                    that.center.push([mapData[i].longitude,mapData[i].latitude])
                let marker = new AMap.Marker({
                    position: [mapData[i].longitude,mapData[i].latitude],
                    offset: new AMap.Pixel(-5,-5),
                    map: that.BMap,
                    icon:new AMap.Icon({            
                        image:mapData[i].icon=='human'? require('../assets/img/Oval 7@3x.png') : require('../assets/img/Oval 3@3x.png'),                        
                        imageSize: new AMap.Size(10,10),
                    }) 
                });
                marker.content = `<div class="mMarker">
                                        <img src=${require('../assets/img/人文@3x.png')}>
                                        <i>${mapData[i].name}</i>
                                    </div>`;
                marker.on('click', function (e) {
                    that.infoWindow.setContent(e.target.content);
                    that.BMap.setCenter([mapData[i].longitude,mapData[i].latitude])
                    that.infoWindow.open(that.BMap, e.target.getPosition());                
                });
                }
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
.mymap{
    height: 100%;
}
.logo{
    position: fixed;
    top: 0.12rem;
    left: 0.12rem;
    height: 1.15rem;
    width: 1.15rem;
    z-index: 200;
}

#maplist{
    height:100%;
    width: 100%;
    z-index: 10;
    position: relative;
}
</style>
<style lang="scss">
.amap-icon{
    img{
        height: 0.1rem;
        width:0.1rem;
        position: relative;
    }
}
.mMarker{
    background:#EAC454;
    padding:0 0.12rem 0 0;
    border:1px solid #fff;
    border-radius: 0.18rem;
    height: 0.34rem;
    max-width: 1.19rem;
    display: flex;
    overflow: hidden;
    align-items:center;
        img{
            height: 0.34rem;
            width: 0.34rem;
            display: inline;
        }
        i{
            display:flex;
            font-size:0.1rem;
            color:#fff;
        } 
}

</style>
