<template>
  <div id="map">
    <header>顺义文创地图</header>
    <div id="container" class="mymap"></div>
    <div class="button"> <img src="../assets/img/Shape@3x.png" alt=""> 切换列表</div>
  </div>
</template>
<script>
import AMap from 'AMap'
export default {
    data (){
        return{
            marker:[]
    }},
    mounted(){
    this.getData();     //加载地图和相关组件
    },
    created (){

    },
    updated() {
        this.getData();     //加载地图和相关组件
    },
    methods: {
        // changeMarke (){
        //      this.marker = new AMap.Marker({ //添加自定义点标记
        //         map:map,
        //         position: [116.708463,40.132709], //基点位置
        //         offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
        //         draggable: false,  //是否可拖动
        //         content: '<div class="marke">aaa</div>'   //自定义点标记覆盖物内容
        //     });
        // },
        getData(){
            this.loadmap();
        },

    //     ddd() {
    //          new AMap.Marker({
    //     map: map,
	// 	position: [116.405467, 39.907761],
    //     icon: new AMap.Icon({            
    //         size: new AMap.Size(40, 50),  //图标大小
    //         image: "https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
    //         imageOffset: new AMap.Pixel(0, -60)
    //     })        
    // }); 


        loadmap(){
        var map = new AMap.Map('container', {
            // dragEnable: this.zoom == 9 ? false : true,
            zoom: 9,
            center: [116.708463,40.132709]
        });
        let marker = new AMap.Marker({ //添加自定义点标记
            position: [116.708463,40.132709], //基点位置
            offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
            draggable: false,  //是否可拖动
            // content: '<div class="marke">aaa</div>'   //自定义点标记覆盖物内容
        });
        map.add(marker)
        map.setMapStyle('amap://styles/'+'whitesmoke');
        AMapUI.load(['ui/geo/DistrictExplorer'], function(DistrictExplorer) {
        //创建一个实例
        let districtExplorer  = new DistrictExplorer({
            map: map
        });


        // map = AMap.event.addListener(marker, "click", function(e) {
		// 	  new AMap.Marker({
		// 		position: e.lnglat,
		// 		map: map
		// 	});
        // });
        
marker.on('click', function(e) {
    new AMap.Marker({
        map: map,
        position: [116.708463,40.132709],
         offset: new AMap.Pixel(-17, -42),
        icon: new AMap.Icon({            
            size: new AMap.Size(40, 50),  //图标大小
            image: "https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
            imageOffset: new AMap.Pixel(0, -60)
        })        
    }); 
});
        switch2AreaNode(110000);
        initPage(DistrictExplorer);
        //绘制某个区域的边界
        function renderAreaPolygons(areaNode) {
            //绘制子区域
            // console.log(areaNode)
            districtExplorer.renderSubFeatures(areaNode, function(feature) {
                    return {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: "#ccc", //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: "red", //填充色
                    fillOpacity: 0.85, //填充透明度
                };
            });
        }
        //切换区域
        function switch2AreaNode(adcode, callback) {
            loadAreaNode(adcode, function(error, areaNode) {
                //移除顺义区的坐标集
                areaNode._data.geoData.sub.features[9].geometry.coordinates = []
                areaNode._data.geoData.sub.features[2].geometry.coordinates[1] = []
                renderAreaPolygons(areaNode)
                if (callback) {
                    callback(null, areaNode);
                }
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
        function initPage(DistrictExplorer) {
            //创建一个实例
            let districtExplorer = new DistrictExplorer({
                map: map
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
                        fillColor: '#F2F2F2', //填充色
                        fillOpacity: 0.85, //填充透明度
                        map: map,
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
#map{
    height: 6.17rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 10;
    position: relative;
}
header{
    height: 0.44rem;
    font-size: 0.17rem;
    text-align: center;
    line-height: 0.44rem;
    font-weight: 900;
    color: #484848;
    border-bottom: 0.01rem solid #EEEEEE;
}
#map .button{
    background:#fff;

    position: absolute;
    bottom: 0.4rem;
    left: 1.32rem;
    width: 1.1rem;
    height: 0.33rem;
    text-align: center;
    line-height: 0.33rem;
    color: #5F5F5F;
    border-radius: 0.165rem;
    padding-left: 0.23rem;
    box-sizing: border-box
}
#map img{
    height: 0.11rem;
    width: 0.13rem;
    position: absolute;
    top:0.11rem;
    left:0.14rem;
}
</style>
