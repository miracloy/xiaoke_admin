<template>
	<div class="content-box">
		<Row>
		  <Col span="6">
		        <Bread></Bread>
		  </Col>
		</Row>
		<div style="background:#eee;padding: 20px">
	        <Card :bordered="false">
	            <p slot="title">系統設置</p>
	            <Row class="margin-10">
	            	<Col span="4">
	            		<Button type="info">清单提醒通知</Button>
	            	</Col>
	            	<Col span="4">
	            		<RadioGroup v-model="BillNotice">
            		       <Radio label="1">开</Radio>
            		       <Radio label="0">关</Radio>
            		   </RadioGroup>
	            	</Col>
	            	<Col span="4">
	            		<InputNumber :max="30" :min="1" v-model="BillNoticeTime" style="width:50px;"></InputNumber> 分钟提醒一次
	            	</Col>
	            </Row>
	            <Row class="margin-10">
	            	<Col span="4">
	            		<Button type="info">订单提醒通知</Button>
	            	</Col>
	            	<Col span="4">
	            		<RadioGroup v-model="OrderNotice">
            		       <Radio label="1">开</Radio>
            		       <Radio label="0">关</Radio>
            		   </RadioGroup>
	            	</Col>
	            	<Col span="4">
	            		<InputNumber :max="30" :min="1" v-model="OrderNoticeTime" style="width:50px;"></InputNumber> 分钟提醒一次
	            	</Col>
	            </Row>
	            <Row class="margin-10">
	            	<Col span="12">
	            		<Button style="float:right;" size="large" @click="save">保存</Button>
	            	</Col>
	            </Row>
	        </Card>
	    </div>
	</div>
</template>
<script>
	export default{
		data(){
			return {
				BillNotice:1,
				BillNoticeTime:5,
				OrderNotice:1,
				OrderNoticeTime:5,
			}	
		},
		methods:{
			 save(){
			 	console.log(this.BillNotice,this.BillNoticeTime,this.OrderNotice,this.OrderNoticeTime);
                this.$Message.success('保存成功！');
            }
		}
	}
</script>