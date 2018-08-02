<template>
  <div id="maplist">
      <!-- <header @click="hclick()"></header> -->
    <img class="logo" src="../assets/img/logo@3x.png" alt="">
    <div id="container" class="mymap"></div>
    <div class="but" @click='init(InfoData)'>
        <img src="../assets/img/Shape2@3x.png" alt="">导航
    </div>
  </div>
  
</template>
<script>
import AMap from 'AMap'
export default {
    data (){
        return{
            BMap:[],
            center:[],
            area:[],
            zoom:[],
            InfoWindow:[],
            InfoData:[]
    }},
    props:['id'],
    beforeMount(){
        this.getData()
    },
    methods: {
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
        //获取数据
        getData(){
            this.$http.get('http://mgmt.sinacolour.com:89/plan/sslist',{
                params:{cursor:1,limit:100,regionIds:546
                }}).then(res=>{
                this.loadmap(res.data.data.regionDetail[0].ssList)
                this.area = this.BMap.getBounds()
                this.BMap.setLimitBounds(this.area)
                this.InfoData= res.data.data.regionDetail[0].ssList
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

            //加载对应信息窗体
            that.infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, 10),
                closeWhenClickMap:true,
                isCustom:true
            });

            for ( let i = 0; i < mapData.length;i++){
                if(mapData[i].id == that.id){
                    that.InfoData = mapData[i]
                    console.log( that.InfoData)
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
                    marker.content = `<div class="mapMarker" style="background:${mapData[i].icon=='human'?'#EAC454':'#56B7F0' }">
                                        <img src=${mapData[i].icon=='human'?require('../assets/img/人文@3x.png'):require('../assets/img/自然@3x.png')}>
                                        <i>${mapData[i].name}</i>
                                        </div>`;
                    marker.on('click', function (e) {
                        that.infoWindow.setContent(e.target.content);
                        that.BMap.setCenter([mapData[i].longitude,mapData[i].latitude])
                        that.infoWindow.open(that.BMap, e.target.getPosition());
                        
                    })
                    marker.emit('click', {target: marker});
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
    .but{
        z-index: 300;
        position: absolute;
        bottom: 0.4rem;
        left:1.47rem;
        background: #fff;
        height: 0.33rem;
        width: 0.82rem;
        border-radius: 16.5rem;
        line-height: 0.33rem;
        font-size: 0.13rem;
        letter-spacing:0.03rem;
        display: flex;
        justify-content:center;
        align-items:center;
        img{
            height: 0.14rem;
            margin-right: 0.1rem
        }
    }
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
.mapMarker{
    padding:0 0.12rem 0 0;
    border:1px solid #fff;
    border-radius: 0.18rem;
    height: 0.34rem;
    max-width: 1.19rem;
    display: flex;
    overflow: hidden;
    align-items:center;
        img{
            height: 0.37rem;
            display: inline;
            float: left;
        }
        i{
            display:flex;
            font-size:0.1rem;
            color:#fff;
        } 
}

</style>
