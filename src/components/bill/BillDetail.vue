<template>
	<div class="content-box">
		<Row>
		  <Col span="6">
		        <Bread></Bread>
		  </Col>
		</Row>
		
		<Row>
		  <Col span="22" offset="1">
		  		<div class="img-box" v-for="v in data1" style="float:left;">
		  			<img :src="v1.url" v-for="v1 in v.medias" style="width:80px;">
		  		</div>
		  </Col>
		  <Col span="22" offset="1" style="margin-bottom:20px;">
		  		<Input type="textarea" placeholder="清单备注" v-model="remarks"></Input>
		  </Col>
		  <Col span="24">
		       <Table stripe border highlight-row :columns="columns1" :data="data1" size="small"></Table>
		  </Col>
		</Row>

		<Row>
		  <Col span="23">
		  	<p class="margin-10" style="text-align:right;">
		  		<Button type="success" size="large" @click="finish">完成</Button>
		  	</p>
		  </Col>
		</Row>

	</div>
</template>
<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate} from '@/api/common.js'
export default{
	data(){
		return {
			spin:false,
			formItem:{},
			data1:[],
			remarks:'',
			columns1: [
					   {
						    title: '编号',
						    key: 'id'
					   },
			           {
			               title: '公司名称',
			               key: 'name'
			           },
			           {
			               title: '负责人姓名',
			               key: 'managerName',
			           },
			           {
			               title: '负责人手机号',
			               key: 'phoneNumber',
			           },
			           {
			               title: '清单名称',
			               key: 'detailListName',
			           },
			           {
			               title: '配送时间',
			               key: 'deliveryDate',
			               render:(h,params)=>{
			                return _timestrToDate(params.row.deliveryDate);
			               }
			           },
			           {
			               title: '清单金额',
			               key: 'total',
			           },
			           {
			               title: '操作',
			               key: 'action',
			               width: 200,
			               align: 'center',
			               render: (h, params) => {
			                   return h('div', [
			                   		h('Button', {
			                   		    props: {
			                   		        type: 'info',
			                   		        size: 'small'
			                   		    },
			                   		    style: {
			                   		        marginRight: '5px'
			                   		    },
			                   		    on: {
			                   		        click: () => {
			                   		            this.$router.push('/bill/index/update/'+params.row.id);
			                   		        }
			                   		    }
			                   		}, '修改'),
			                       h('Button', {
			                           props: {
			                               type: 'error',
			                               size: 'small'
			                           },
			                           style: {
			                               marginRight: '5px'
			                           },
			                           on: {
			                               click: () => {
			                                   
			                               }
			                           }
			                       }, '删除'),
			                   ]);
			               }
			           }
			       ],
		}
	},
	mounted(){
		var id = this.$route.params.id;
		// 添加响应拦截器
		axios.interceptors.request.use(function (config) {
		    this.spin = true;
		    return config;
		  }.bind(this), function (error) {
		    // 对请求错误做些什么
		    return Promise.reject(error);
		  });
		axios.interceptors.response.use(function (response) {
		    this.spin = false;
		    if(response.data.errorCode==401){
		      this.$Message.error('登录超时,请重新登录');
		      setTimeout(()=>{
		        this.$router.replace('/login');
		      },2000); 
		    }
		    return response;
		  }.bind(this), function (error) {
		    // 对响应错误做点什么
		    return Promise.reject(error);
		  });

		axios.get(URL+'list/child/'+id).then(function(res){
		  var data = res.data;
		  this.data1 = data.data;
		  if(this.data1[0].remarks){
		  	this.remarks = this.data1[0].remarks;
		  }
		}.bind(this)).catch(function(error){
		  console.log(error);
		});
	},
	methods:{
		finish(){
			var id = this.$route.params.id;

			var params = new URLSearchParams();
			params.append('finish',1);
			axios.post(URL+'list/'+id,params).then(function(res){
			  if(res.data.errorCode!=200){
			    this.$Message.error(res.data.moreInfo);
			  }else{
			    this.$Message.success('请求成功');
			    this.$router.replace('/bill/index/index');
			  }
			}.bind(this)).catch(function(error){
			  this.$Message.error('请求失败');
			}.bind(this));



		}
	}
}
</script>
<style scoped>  
	
</style>