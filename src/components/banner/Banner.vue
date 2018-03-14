<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Row class="margin-10">
      <Col span="2" offset="20">
        <div class="addBox">
          <Button type="info" icon="plus" ><router-link tag="span" to="/banner/index/add">新增广告消息</router-link></Button>
        </div>
      </Col>
    </Row>
    
    <div class="layout-content-main">
     <Table stripe border highlight-row :columns="columns1" :data="data1"></Table>
     <div style="margin: 10px;overflow: hidden">
           <div style="float: right;">
               <Page :total="total" :current="current" @on-change="changePage"></Page>
           </div>
     </div>


    </div>

    <Spin class="demo-spin-col" v-if="spin">
        <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>

  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate} from '@/api/common.js'
export default {
  data () {
    return {
      total:0,
      current:1,
      spin:false,
      searchStr:'',
      size:10,
      data1: [],
      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '消息名称',
                     key: 'name',
                 },
                 {
                     title: '消息类型',
                     key: 'types',
                     render:(h,params)=>{
                        var typesArr = ['消息','插屏','banner页'];
                        var typeName = '';
                        params.row.types.forEach((v,i)=>{
                          var index = v-1;
                          typeName += typesArr[index]+' ';
                        });
                        return typeName;
                     }
                 },
                 {
                     title: '创建时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.createdAt);
                     }
                 },
                 {
                     title: '消息状态',
                     key: 'status',
                     render: (h, params) => {
                        var type = params.row.status==0 || params.row.status==null ? 'error' : 'success';
                        var typeName = params.row.status==0 || params.row.status==null ? '未显示' : '显示中';

                        var icon = params.row.status==0 || params.row.status==null ? 'ios-arrow-thin-up' : 'ios-arrow-thin-down';

                         return h('div', [
                             h('Button', {
                                 props: {
                                     type: type,
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 }
                             }, typeName),
                             h('Button', {
                                 props: {
                                     type: 'default',
                                     size: 'small',
                                     icon:icon,
                                 },
                                 on: {
                                     click: () => {
                                         this.changeOnSale(params.row._index);
                                     }
                                 }
                             }),
                         ]);
                     }
                 },
                 {
                     title: '显示级别',
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
                                     type: 'primary',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.$router.push('/banner/index/update/'+params.row.id);
                                     }
                                 }
                             }, '修改'),
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
                                         this.deleteGoods(params.index);
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

    if(this.$route.query.categoryId){
      this.categoryId = this.$route.query.categoryId;
    }

    this.dataInit();

  },
  methods:{
    dataInit(){
      axios.get(URL+'banner',{
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
      axios.get(URL+'banner',{
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
      n = n-1;
      axios.get(URL+'banner',{
        params:{
          page:n,
          size:this.size,
        }
      })
        .then(function(res){
          var data = res.data.data;
          this.total = data.total;
          this.current = data.current+1;
          this.data1 = data.data.data;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    changeOnSale(index){
      var status = 0;
      var id = this.data1[index].id;
      if(this.data1[index].status==1){
        this.data1[index].status = 0;
        status = 0;
      }else{
        this.data1[index].status = 1;
        status = 1;
      }
      axios.put(URL+'banner/status/'+id+'?status='+status).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));
    },
    deleteGoods(index){
      var id = this.data1[index].id;
      axios.delete(URL+'banner/'+id).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('删除成功');
        }
      }.bind(this)).catch(function(error){
        this.$Message.error('删除失败');
      }.bind(this));
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
