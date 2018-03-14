<template>
	<div>
		<Row>
		  <Col span="6">
		        <Bread></Bread>
		  </Col>
		</Row>
	
		<Row class="margin-10">
		  <Col span="2" offset="20">
		    <div class="addBox">
		      <Button type="info" icon="plus" ><router-link tag="span" to="/bill/index/groupAdd">新增商品组合</router-link></Button>
		    </div>
		  </Col>
		</Row>
		
		<div class="layout-content-main">
		 <Table stripe border highlight-row :columns="columns1" :data="data1" size="small"></Table>
		 <div style="margin: 10px;overflow: hidden">
		     <div style="float: right;">
		         <Page :total="total" :current="current" @on-change="changePage"></Page>
		     </div>
		 </div>
		</div>


	</div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate} from '@/api/common.js'
export default {
  data () {
    return {
      newUser:{
        company:'',
        name:'',
        phone:'',
        address:'',
        credit:0,
        area:''
      },
      addModal:false,
      date:'',
      total:0,
      size:10,
      current:1,
      spin:false,
      searchStr:'',
      data1: [],
      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '商品组合名称',
                     key: 'name'
                 },
                 {
                     title: '创建时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.createdAt);
                     }
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
                                         this.$router.push('/bill/index/groupUpdate/'+params.row.id);
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
                                         this.deleteGroup(params.index);
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
      axios.get(URL+'productGroup',{
        params:{
          page:0,
          size:this.size,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    updateInit(){
      axios.get(URL+'productGroup',{
        params:{
          page:this.current-1,
          size:this.size,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    changePage(n){
      this.spin = true;
      axios.get(URL+'order/paginate?page='+n)
        .then(function(res){
          var data = res.data;
          this.total = data.total;
          this.current = data.current_page;
          this.data1 = data.data;
          this.spin = false;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    deleteGroup(index){
      var id = this.data1[index].id;
      axios.delete(URL+'productGroup/'+id).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('删除成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      }.bind(this));
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>