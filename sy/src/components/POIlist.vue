<template>
    <div id="scenic">
        <div class="sceniccont" v-for="n in POIinfo" :key="n.id" @click="sceClick(n.id)">
            <img :src="n.cover_img+'-Newdeer21'" alt="">
            <h2>{{n.name}}</h2>
            <h3>
                <i v-for="(i,a) in n.natureList" :key="i.id" v-if="a<3"><span v-if="a > 0"> · </span>{{i.value}}</i>
            </h3>
            <div class="impression">
                <p style="-webkit-box-orient: vertical"><span>活动亮点：</span>{{n.description150}}</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data (){
        return{
            POIinfo:[]
        }
    },
    methods:{
        getData(){
            this.$http.get('http://mgmt.sinacolour.com:89/plan/sslist',{
                params:{cursor:1,limit:100,regionIds:546
                }}).then(res=>{
                console.log(res.data.data.regionDetail[0].ssList)
                this.POIinfo = res.data.data.regionDetail[0].ssList 
            })
        },
        sceClick(id){
            console.log('go')
            this.$router.push({path:'/poiinfo/'+id})
        }
    },
    mounted (){
        this.getData()
    }
}
</script>
<style lang="scss" scoped>
#scenic{
    padding-bottom: 0.3rem
}
.sceniccont{
    margin: 0.23rem auto;
    width: 3.27rem;
    
}
.sceniccont img{
    height: 1.64rem;
    width: 3.27rem;
    background: #ccc;
    border-radius: 4px;
}
.sceniccont h2{
    margin: 0.16rem 0 0.06rem;
    font-size: 0.17rem;
    line-height: 0.17rem;
    min-height: 0.17rem;
    font-weight: 900;
    color: #484848;
}
.sceniccont h3{
    font-size: 0.12rem;
    color: #3F3F3F;
    height: 0.17rem;
    line-height: 0.17rem;
    overflow: hidden;
}
.sceniccont .impression{
    font-size: 0.12rem;
    line-height: 0.18rem;
    color: #3F3F3F; 
    max-height: 0.54rem;
    overflow: hidden;
    margin: 0.06rem 0 0.3rem;
    p{
        display: -webkit-box;
        // -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
}
.impression span{
    color: #119DFF
}
</style>
