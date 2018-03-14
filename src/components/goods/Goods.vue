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
          <Button type="info" icon="plus" ><router-link tag="span" to="/goods/index/add">添加</router-link></Button>
        </div>
      </Col>
      <Col span="6" offset="16">
        <div class="searchBox">
          <Input v-model="searchStr" icon="ios-search" placeholder="名称/编号" style="width: 200px"></Input>
          <Button type="primary" @click="search">搜索</Button>
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
export default {
  data () {
    return {
      total:0,
      current:1,
      spin:false,
      searchStr:'',
      size:10,
      data1: [],
      categoryId:'',
      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '图片',
                     key: 'skuMedia',
                     render:(h,params)=>{
                        var imgSrc = '';
                        if(params.row.skuMedia.primary){
                          imgSrc = params.row.skuMedia.primary.url;
                        }
                        
                        return h('Avatar',{
                                props:{
                                  src:imgSrc,
                                  size:'large',
                                  shape:'square'
                                }
                              },'');
                     }
                 },
                 {
                     title: '名称',
                     key: 'name',
                 },
                 {
                     title: '分类',
                     key: 'categoryName',
                 },
                 {
                     title: '价格',
                     key: 'minPrice',
                 },
                 {
                     title: '状态',
                     key: 'isOnSale',
                     render: (h, params) => {
                        var type = params.row.isOnSale==0 || params.row.isOnSale==null ? 'error' : 'success';
                        var typeName = params.row.isOnSale==0 || params.row.isOnSale==null ? '已下架' : '上架中';

                        var icon = params.row.isOnSale==0 || params.row.isOnSale==null ? 'ios-arrow-thin-up' : 'ios-arrow-thin-down';

                         return h('div', [
                             h('Button', {
                                 props: {
                                     type: type,
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.$router.push('/goods/index/update/'+params.row.id);
                                     }
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
                                         this.$router.push('/goods/index/update/'+params.row.id);
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
      axios.get(URL+'product',{
        params:{
          page:0,
          size:this.size,
          categoryId:this.categoryId,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    updateInit(){
      axios.get(URL+'product',{
        params:{
          page:this.current-1,
          size:this.size,
          categoryId:this.categoryId,
          key:this.searchStr,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    changePage(n){
      n = n-1;
      axios.get(URL+'product',{
        params:{
          page:n,
          size:this.size,
          key:this.searchStr,
          categoryId:this.categoryId,
        }
      })
        .then(function(res){
          var data = res.data.data;
          this.total = data.total;
          this.current = data.current+1;
          this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    search(){
      axios.get(URL+'product',{
        params:{
          page:0,
          size:this.size,
          key:this.searchStr,
          categoryId:this.categoryId,
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    changeOnSale(index){
      var onsale = 0;
      var id = this.data1[index].id;
      if(this.data1[index].isOnSale==1){
        this.data1[index].isOnSale = 0;
        onsale = 0;
      }else{
        this.data1[index].isOnSale = 1;
        onsale = 1;
      }
      var params = new URLSearchParams();
      params.append('onsale',onsale);
      axios.post(URL+'product/onSale/'+id,params).then(function(res){
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
      axios.delete(URL+'product/'+id).then(function(res){
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
