<template>
	<div class="comments">
		<form enctype ="multipart/form-data">
			<div class="header">
				<span class="back" @click="back">
					<img src="./images/Shape@2x.png" height="40" width="20" alt="">
				</span>
				<span class="title">写评论</span>
				<span class="release" @click="submit">发布</span>
			</div>
			<div id="text">
		        <p class="all" v-if="pf">
		          	<input type="radio" name="b" v-model="pfNum" value="0" checked="checked" />
		          	<span>★</span>
		          	<input type="radio" name="b" v-model="pfNum" value="1" />
		          	<span>★</span>
		          	<input type="radio" name="b" v-model="pfNum" value="2" />
		          	<span>★</span>
		          	<input type="radio" name="b" v-model="pfNum" value="3" />
		          	<span>★</span>
		          	<input type="radio" name="b" v-model="pfNum" value="4" />
		          	<span>★</span>
		          	<input type="radio" name="b" v-model="pfNum" value="5" />
		          	<span>★</span>
		        </p>
		        <p class="pfName" v-if="pfNum!=0">
		          <span class="left"></span>
		          <span v-if="pfNum==1">太烂了</span>
		          <span v-if="pfNum==2">不喜欢</span>
		          <span v-if="pfNum==3">一般般</span>
		          <span v-if="pfNum==4">还不错</span>
		          <span v-if="pfNum==5">超级赞</span>
		          <span class="right"></span>
		        </p>
				<textarea rows="6" name="comment" id="textarea" v-model="releaseData.comment" onfocus="if(value=='分享您的评论(至少15个字)'){value=''}" onblur="if (value ==''){value='分享您的评论(至少15个字)'}">分享您的评论 (至少15个字)</textarea>
				<span class="name">{{names}}</span>
			</div>
			<p class="p"></p>

			<div class="imgs">
				<div class="imgBox" 
				v-for="(img,index) in imgArr"  
				v-if="imgArr.length>0"
				:style="{ 'backgroundImage': 'url(' + img +')' }"
				:key="index"
				@click.stop="imgClick(img)">
					<!-- <img :src="img" alt=""> -->
					<span @click.stop="delImg(index)">一</span>
				</div>
				<div class="imgUpload" v-if="imgArr.length<9">
					<img src="./images/WechatIMG2.png" alt="">
					<!-- <input type="file" id="file" name="avatar" @change="imgUpload" ref="imgUp"> -->
					<input class="file" name="file" id="file" type="file" accept="image/*" @change="imgUpload" ref="imgUp"/>

				</div>
			</div>
		</form>
		<div class="bigImg" v-if='showImg' @click="showImg=false">
			<img :src="bigImg" alt="">
		</div>
	</div>
</template>
<script>
import { Indicator } from 'mint-ui';
	export default{
		data(){
			return{
        		pfNum:0,
				id:'',
				names:'',
				commentUrl:'/comment/publish',
				imgNum:0,
				imgSrc:'',
				falg:false,
				imgArr:[],
				releaseData:{
					itemId:'',
					itemName:this.names,
					itemType:'1',
					comment:'分享您的评论(至少15个字)',
					token:localStorage.getItem('token'),
				},
				inputtext:{},
				imgData:[],
				formData:{},
        		pf:false,
        		showImg:false,
        		bigImg:'',
			}
		},
		methods:{
			imgClick(img){
				this.showImg = true;
				this.bigImg = img;
			},
			delImg:function(index){
				this.imgArr.splice(index,1);
				this.imgData.splice(index,1);
			},
			back:function(){
				window.history.back();
			},
			submit:function(){
				var _this = this;
				if (this.releaseData.comment.length < 15 || this.releaseData.comment.length > 150) {
					alert('评论至少15个字，至多150个字！');
					return;
				};
				if(localStorage.getItem('pf') == 'pingfen'){
		          	if (this.pfNum == 0){
		              	alert('请打分！');
		              	return;
		          	}
        		}
        		Indicator.open();
				for(var i = 0; i < this.imgData.length; i++){
					this.formData.append("file"+i, this.imgData[i]);
				}
				this.formData.append('itemId',this.$route.params.id);
				this.formData.append('itemName',this.$route.params.name);
				this.formData.append('itemType','1');
				this.formData.append('comment',this.releaseData.comment);
				this.formData.append('token',tool.token());
				this.formData.append('score',this.pfNum);
				let config = {
            		headers:{'Content-Type':'multipart/form-data'}
			    };  //添加请求头
				this.$http.post('http://mgmt.sinacolour.com:88'+this.commentUrl, this.formData,config).then(function (res) {
					if (res.data.code != '0') {
						alert('评论失败！')
					}
					Indicator.close();
					_this.$router.go(-1)
			    })
			},
			imgUpload:function(){
			    var reader = new FileReader();
			    var that = this;
			    reader.onload = function(evt) {
			    	// that.imgSrc = evt.target.result
			    	that.imgArr.push(evt.target.result);
			    }
			    reader.readAsDataURL(this.$refs.imgUp.files[0]);
			    this.imgData.push(this.$refs.imgUp.files[0]);
			},
		},
		mounted:function(){
	      	let pf = localStorage.getItem('pf')
	      	if (pf == 'pingfen'){
	          	this.pf = true;
	      	}else {
	          	this.pf = false;
	      	}
			this.names = this.$route.params.name
			this.formData = new FormData();
		},
    	watch:{
    	}
	}
</script>
<style src='./comments.css' scoped></style>

