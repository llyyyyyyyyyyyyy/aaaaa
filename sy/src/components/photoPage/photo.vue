<template>
	<div id="photo" :style="winHeight">
		<swiper :options="swiperOption" ref="mySwiper" v-if="this.imgArr.length>0">
		    <swiper-slide style="" v-for="(img,i) in imgArr" :key="i">
		    	<img :src="img.img" style="width:100%;" alt="">
		    	<div class="swiper-lazy-preloader" slot="preloader"></div>
		    </swiper-slide>
	    	<div class="swiper-pagination"  slot="pagination"></div>
		</swiper>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
	export default{
		data(){
			return{
				imgUrl:'',
				winHeight:'',
				imgArr:[],
				num:0,
				swiperOption: {
		          	autoplay: false,
		          	initialSlide: 0,
		          	// loop: true,
		          	pagination: '.swiper-pagination',
		          	preloader: 'swiper-lazy-preloader',
		          	lazyLoading : true,
		          	paginationType : 'fraction',
		          	autoplayDisableOnInteraction : false,
		        }
			}
		},
		components: {
		    swiper,
		    swiperSlide
		},
		computed: {
	        ...mapGetters(['photo'])
	    },
		methods: {
			backClick() {
				window.history.back();
			},
		},
	  	mounted() {

	  		
	  		this.swiperOption.initialSlide = parseInt(this.$route.params.num);
	  		this.imgArr = this.photo;
	  		console.log(this.imgArr.length)
	  		this.winHeight = 'height:'+window.innerHeight+'px;';
	  	},
	}
</script>
<style>
	#photo{
		background-color: black;
		font-size: 0.16rem;
		color: #fff;
		overflow: hidden;
	}
	#photo .swiper-slide{
		display: flex;
		align-items: center;
	}
	#photo .swiper-container{
		height: 100%;
		overflow: visible;
	}
	#photo .swiper-pagination{
		position: fixed;
		bottom: 0.2rem;
	}
	#photo .back{
		height: 0.6rem;
		position: relative;
	}
	#photo .back img{
		width: 0.099rem;
		height: 0.185rem;
		position: absolute;
		top:0.33rem;
		left: 0.2rem;
	}
	#photo>img{
		width: 100%;
	}
</style>
