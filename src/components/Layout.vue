<template>
	<div style="height:100%;">
		<div class="layout">
		     <Menu mode="horizontal" theme="dark" active-name="0">
		         <div class="layout-logo"><span class="logo">下午茶</span></div>
		         <div class="layout-nav">
                 <MenuItem name="0">
                     <router-link tag="div" to="/index/welcome"><Icon type="home"></Icon> 欢迎页</router-link>
                 </MenuItem>
		             <MenuItem name="1">
		                 <router-link tag="div" to="/goods"><Icon type="ios-cart"></Icon> 商品</router-link>
		             </MenuItem>
		             <MenuItem name="2">
		             	 <router-link tag="div" to="/user"><Icon type="ios-person"></Icon> 用户</router-link>
		             </MenuItem>
		             <MenuItem name="3">
		             	 <router-link tag="div" to="/bill"><Icon type="ios-paper"></Icon> 清单管理</router-link>
		             </MenuItem>
		             <MenuItem name="4">
		             	 <router-link tag="div" to="/order"><Icon type="ios-list"></Icon> 订单管理</router-link>
		             </MenuItem>
		             <MenuItem name="5">
		             	 <router-link tag="div" to="/finance"><Icon type="social-yen"></Icon> 财务</router-link>
		             </MenuItem>
		             <MenuItem name="6">
		             	 <router-link tag="div" to="/banner"><Icon type="android-settings"></Icon> 广告消息</router-link>
		             </MenuItem>
		             <MenuItem name="7">
                    <router-link tag="div" to="/active"><Icon type="card"></Icon> 特价活动专区</router-link>
                  </MenuItem>
                 <MenuItem name="8">
                   <router-link tag="div" to="/checkbalance"><Icon type="ios-list"></Icon> 对账管理</router-link>
                 </MenuItem>
		         </div>
		         <Button type="dashed" class="logout" @click="logout">退出登录</Button>
		         <Button type="dashed" class="logout" icon="person">{{admin}}</Button>
		     </Menu>
		     <router-view></router-view>
		 </div>
	</div>
</template>
<script>
	export default{
		data(){
			return{

			}
		},
		computed:{
			admin(){
				return this.$store.state.user;
			}
		},
		methods:{
			logout(){
				window.sessionStorage.removeItem('token');
				this.$router.replace('/login');
			}
		}
	}
</script>
<style scoped>
	.layout{
	    border: 1px solid #d7dde4;
	    background: #f5f7f9;
	}
	.layout-logo{
	    width: 100px;
	    height: 30px;
	    background: #5b6270;
	    border-radius: 3px;
	    float: left;
	    position: relative;
	    top: 15px;
	    left: 20px;
	}
	.layout-nav{
	    width: 800px;
	}
	.layout-assistant{
	    width: 300px;
	    margin: 0 auto;
	    height: inherit;
	}
	.layout-breadcrumb{
	    padding: 10px 15px 0;
	}
	.layout-content{
	    min-height: 200px;
	    margin: 15px;
	    overflow: hidden;
	    background: #fff;
	    border-radius: 4px;
	}
	.layout-content-main{
	    padding: 10px;
	    min-height: 600px;
	}
	.layout-copy{
	    text-align: center;
	    padding: 10px 0 20px;
	    color: #9ea7b4;
	}

	.logout{
		float: right;
		margin:15px 10px;
		color: #ccc;
	}

	.logo{
		display: inline-block;
		height: 30px;
		line-height: 30px;
		color: #fff;
		font-size: 16px;
		position: absolute;
		left: 25px;
	}
	.layout-logo{
		margin-right: 10px;
	}

	.layout-nav{
		width: 1300px;
	}
</style>
