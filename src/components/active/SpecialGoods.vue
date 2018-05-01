<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>
    <Row class="margin-10">
      <Col span="12">
        <div class="searchBox addBox">
          <Input v-model="key" icon="ios-search" placeholder="输入关键字" style="width: 200px"></Input>
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

    <Modal
        v-model="showModal"
        title="添加特价商品"
        @on-ok="addSpecialProduct">
        <Row>
          <Col span="6">
              <p class="margin-10">特价</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
              <InputNumber :max="100000" :min="0" v-model="info.specialPrice"></InputNumber> 元
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">特价栏目</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Select v-model="info.categoryId" style="width:200px">
                    <Option v-for="item in cate" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </p>
          </Col>
        </Row>

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
import {_timestrToDate} from '@/api/common.js'
export default {
  data () {
    return {
      showModal:false,
      total:0,
      current:1,
      spin:false,
      key:'',
      size:10,
      data1: [],
      info:{
        specialPrice:0,
        productId:'',
        categoryId:'',
      },
      cate:[],//特价栏目
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
                     title: '售价',
                     key: 'minPrice',
                 },
                 {
                     title: '特价',
                     key: 'specialPrice',
                 },
                 {
                     title: '状态',
                     key: 'isOnSale',
                     render:(h,params)=>{
                        if(params.row.isOnSale){
                          return '上架';
                        }else{
                          return '下架';
                        }
                     }
                 },
                 {
                    title:'操作',
                    key:'action',
                    align:'center',
                    render:(h,params) => {
                      if(params.row.specialPrice){
                        return h('div', [
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
                                      this.removeSpecialProduct(params.row.id);
                                    }
                                }
                            }, '移除特价商品'),
                        ]);
                      }else{
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
                                      this.info.specialPrice = Number(params.row.specialPrice);
                                      this.info.productId = params.row.id;
                                      this.showModal = true;
                                    }
                                }
                            }, '添加到特价商品'),
                        ]);
                      }
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
      axios.get(URL+'specialActivity/product',{
        params:{
          page:0,
          size:this.size,
          key:this.key
        }
      }).then(function(res){
        var data = res.data.data;
        console.log(data);
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
      this.getSpecialCategory();
    },
    updateInit(){
      axios.get(URL+'specialActivity/product',{
        params:{
          page:this.current-1,
          size:this.size,
          key:this.key
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
      axios.get(URL+'specialActivity/product',{
        params:{
          page:n,
          size:this.size,
          key:this.key
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
      axios.get(URL+'specialActivity/product',{
        params:{
          page:0,
          size:this.size,
          key:this.key
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
    // 发放
    giveOut(){
      axios.post(URL+'specialActivity/sendProduct/'+this.give_id,{}).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 筛选查询
    statusChange(e){
      this.status = e;
      this.updateInit();
    },
    // 移除特价商品
    removeSpecialProduct(id){
      var params = new URLSearchParams();
      params.append('productId', id);

      axios.post(URL+'specialActivity/removeSpecialProduct',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 添加特价商品
    addSpecialProduct(){
      var params = new URLSearchParams();
      params.append('productId', this.info.productId);
      params.append('specialPrice', this.info.specialPrice);
      params.append('categoryId', this.info.categoryId);

      axios.post(URL+'specialActivity/addSpecialProduct',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 获取特价栏目
    getSpecialCategory(){
      axios.get(URL+'specialActivity/getSpecialCategory',{}).then(function(res){
        console.log(res.data);
        this.cate = res.data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
