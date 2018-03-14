<template>
	<div class="bread-box">
		<div class="bread-item">
			<router-link tag="span" to="/index/welcome" class="link">首页</router-link>
		</div>
		<div class="bread-item" v-for="(v,i) in $route.matched" v-if="i!=0 && i!=$route.matched.length-1">
			<span style="display:inline-block;padding:0 10px;">/</span><router-link tag="span" class="link" :to="v.path">{{v.meta.breadcrumb}}</router-link>
		</div>
		<div class="bread-item" v-for="(v,i) in $route.matched" v-if="i==$route.matched.length-1">
			<span style="display:inline-block;padding:0 10px;">/</span><span style="font-weight:bold;">{{v.meta.breadcrumb}}</span>
		</div>
	</div>
</template>
<style scoped>
.link{
	cursor: pointer;
}
.link:hover{
	color: #abcdef;
}
.bread-box{
	color: #999;
	font-size: 14px;
	padding:10px;

}
.bread-item{
	display: inline-block;
}
</style>