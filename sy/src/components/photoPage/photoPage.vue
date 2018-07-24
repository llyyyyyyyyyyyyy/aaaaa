<template>
	<div id="photoPage">
		<photo-page :imgsArr="imgsArr"></photo-page>
	</div>
</template>
<script>
	import photoPage from "./photoWaterfall/vue-waterfall-easy.vue";
	export default{
		data(){
			return{
				imgsArr: [],
				fetchImgsArr: [],
				photoArr:[]
			}
		},
		components:{photoPage},
		methods: {
			back(){
				window.history.back();
			},
		    // 假数据
		    initImgsArr(n, m) { //num 图片数量
		      	var arr = []
		      	for (var i = 0; i < this.photoArr.length; i++) {
		        	arr.push({ src: this.photoArr[i] })
		      	}
		      	return arr
		    },
		  },
	  	created() {
	    	this.imgsArr = this.initImgsArr(0, 10)
	    	// this.fetchImgsArr = this.initImgsArr(10, 20) // 模拟每次请求的新的图片的数据数据
	  	},
	}
</script>
<style lang="css" src="./photoPage.css"></style>
