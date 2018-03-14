<template>
	<div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

		<Row class="margin-10">
		  <Col span="2">
		    <div class="addBox">
		      <Button type="info" icon="plus" @click="addModal=true">添加</Button>
		    </div>
		  </Col>
		</Row>
		
		<div class="layout-content-main">
		 <Table stripe border highlight-row :columns="columns1" :data="data1" size="small"></Table>
		</div>

		<Modal
		    v-model="addModal"
		    title="添加分类"
		    @on-ok="add"
		    @on-cancel="addModal=false">
		    <p class="margin-10">名称 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="signData.name" placeholder="名称" style="width: 300px" ></Input></p>
		    <p class="margin-10">排序 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="signData.order" placeholder="排序" style="width: 300px" ></Input></p>
		</Modal>

		<Modal
		    v-model="UpdateModal"
		    title="修改分类"
		    @on-ok="update"
		    @on-cancel="UpdateModal=false">
		    <p class="margin-10">名称 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="updateData.name" placeholder="名称" style="width: 300px" ></Input></p>
		    <p class="margin-10">排序 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="updateData.order" placeholder="排序" style="width: 300px" ></Input></p>
		</Modal>
  
  <Spin class="demo-spin-col" v-if="spin">
      <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
  </Spin>

	</div>
</template>
<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
export default {
  data () {
    return {
      addModal:false,
      UpdateModal:false,
      spin:false,
      signData:{
      	name:'',
      	order:0
      },
      updateData:{
        name:'',
        order:0
      },
      update_id:0,
      data1: [],
      columns1: [
                 {
                     title: '类别名称',
                     key: 'name'
                 },
                 {
                     title: '商品',
                     key: 'goods',
                     render:(h,params)=>{
                        return h('Button',{
                                props:{
                                  type:'primary',
                                  size:'small'
                                },
                                on:{
                                	click:()=>{
                                		this.$router.push('/goods/index/index?categoryId='+params.row.id);
                                	}
                                }
                              },'查看');
                     }
                 },
                 {
                     title: '排序',
                     key: 'displayOrder',
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
                                     type: 'warning',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.UpdateModal = true;
                                         this.updateData.name = params.row.name;
                                         this.updateData.order = params.row.displayOrder;
                                         this.update_id = params.row.id;
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
                                         this.deleteCate(params.row.id);
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
        this.dataInit();
  },
  methods:{
    dataInit(){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
  	add(){
      var params = new URLSearchParams();
      params.append('name', this.signData.name);
      params.append('order', this.signData.order);
      axios.post(URL+'category',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.signData.name = '';
          this.signData.order = 0;
          this.dataInit();
          this.$Message.success('添加成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));
  	},
    update(){
      axios.put(URL+'category/'+this.update_id+'?name='+this.updateData.name+'&order='+this.updateData.order).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateData.name = '';
          this.updateData.order = 0;
          this.update_id = 0;
          this.dataInit();
          this.$Message.success('修改成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('修改失败');
      }.bind(this));
    },
    deleteCate(id){
      axios.delete(URL+'category/'+id).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.dataInit();
          this.$Message.success('删除成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      }.bind(this));
    }
  }
}
</script>
<style scoped>

</style>