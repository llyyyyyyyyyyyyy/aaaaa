<template lang="html">
  <pre id="author"></pre>
</template>

<script>
export default {
  name: 'author',
  data () {
    return {
      code: '',
      appid: 'wx3bcca88734756af0'
    }
  },
  created () {
    // 微信授权后携带 code 参数
    if(location.search && location.search.indexOf('code') > -1){
      var query = location.search.replace('?', '').split('&');
      query.forEach((item) => {
        if (item.indexOf('code') > -1) {
          this.code = item.split('=')[1];
          this.login();
        }
      });
    }else{
      var redirect_uri = encodeURI(window.host);

      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=shunyi&connect_redirect=1#wechat_redirect';
    }
  },
  methods: {
      login () {
        let url = 'http://shunyi.sinacolour.com/shunyi/wx/wechat/login?code=' + this.code + '&state=shunyi';
        let _this = this;
        // 获取用户信息
        this.$http.get(url)
          .then(({ data }) => {
            if(data.code == '0'){
              console.log(data)
              // document.querySelector('#author').innerHTML = JSON.stringify(data);

              var result = data.data;
              localStorage.setItem('token', result.token);
              localStorage.setItem('userId', result.user.userId);
              localStorage.setItem('nickName', result.user.nickName);
              localStorage.setItem('personSign', result.user.personSign);
              localStorage.setItem('photo', result.user.photo || '');
              // _this.$router.replace('/');
              _this.$router.push({path: '/'})
              // if(tool.cookie.set('beforeLoginUrl')){
              //   _this.$router.replace(tool.cookie.set('beforeLoginUrl'));
              // }else{
              //   _this.$router.replace('/');
              // }
            }else{
              console.log(data.msg);
              alert(data.msg);
              window.close();
            }
          });
      }
  }
}
</script>
