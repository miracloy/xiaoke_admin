<template>	
		<div class="content-box">
			<h1>欢迎使用下午茶后台</h1>
			<Row>
				<Col span="12">
					<p><Button type='success' size='large'>今日需配送订单数：1</Button></p>
				</Col>
				<Col span="12">
					<p><Button type='info' size='large' >当前需处理订单数：1</Button></p>	
				</Col>
			</Row>
		</div>
</template>
<script>
	export default{
		data(){
			return {

			}
		},
	}
</script>
<style scoped>
h1{
	font-size: 24px;
	text-align: center;
	margin:100px auto;
}
p{
	text-align: center;
	font-size: 14px;
}
</style>