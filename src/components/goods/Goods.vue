<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

    <Row class="margin-10">

      <Col span="18">
        <div class="searchBox">
          <Tag v-if="showTag" closable @on-close="handleClose">{{this.categoryName}}</Tag>
          <Select v-if="!showTag"  v-model="categoryId2" style="width:120px" placeholder="类别">
            <Option v-for="item in categoryList" :value="item.categoryId" :key="item.categoryKey">{{item.categoryName}}</Option>
          </Select>
          <Select v-model="isOnSale" style="width:70px" placeholder="上下架">
            <Option v-for="item in saleList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
          </Select>
          <Select v-model="isOnShow" style="width:70px" placeholder="隐藏/显示">
            <Option v-for="item in showList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
          </Select>
          <Select v-model="sortMethod" style="width:100px" placeholder="排序">
            <Option v-for="item in sortMethodList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
          </Select>
<!--
          <Input v-model="company" icon="ios-search" placeholder="供应商" style="width: 150px"></Input>
-->
          <Tag v-if="showTagCompany" closable @on-close="handleCloseCompany">{{this.companyName}}</Tag>
          <Select v-if="!showTagCompany" filterable clearable v-model="companyId2" placeholder="供应商选择" style="width:240px;" >
            <Option v-for="item in companyList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
          <Input v-model="searchStr" icon="ios-search" placeholder="商品名称" style="width: 150px"></Input>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="dashed" @click="clear">置空</Button>
        </div>
      </Col>
      <Col span="6">
        <div class="addBox">
          <Button type="success" icon="plus" shape="circle"><router-link tag="span" to="/goods/index/add">添加</router-link></Button>
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
      v-model="infoModal"
      title="查看"
      @on-cancel="infoModal=false">

      <Collapse v-model="value1">
        <Panel name="1">
           基础信息
          <p slot="content">
          <Row>
            <Col span="4">
            <p class="margin-10">类别：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.categoryName}}</p>
            </Col>
            <Col span="4">
            <p class="margin-10">发票类型：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.invoice}}</p>
            </Col>
          </Row>

          <Row>
            <Col span="4">
            <p class="margin-10">商品名称：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.name}}</p>
            </Col>
            <Col span="4">
            <p class="margin-10">排序：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.orderNumber}}</p>
            </Col>
          </Row>

          <Row>
            <Col span="4">
            <p class="margin-10">供应商：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.companyName}}</p>
            </Col>
            <Col span="4">
            <p class="margin-10">简介：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.description}}</p>
            </Col>
          </Row>

          <Row>
            <Col span="4">
            <p class="margin-10">商品图片：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">
              <img :src= info.imgs[0] style="height:50px;margin-right:10px;">
            </p>
            </Col>
            <Col span="4">
            <p class="margin-10">详情：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.longDescription}}</p>
            </Col>
          </Row>

          <Row>
            <Col span="4">
            <p class="margin-10">下单要求：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.orderRule}}</p>
            </Col>
          </Row>

          <Row>
            <Col span="4">
            <p class="margin-10">供应需求：</p>
            </Col>
            <Col span="6">
            <p class="margin-10">{{info.supplyRule}}</p>
            </Col>
          </Row>
          </p>
        </Panel>
        <Panel name="2">
           商品 SKU
          <p slot="content">
            <Table stripe border highlight-row :columns="columns2" :data="data2"></Table>
          </p>
        </Panel>
      </Collapse>


    </Modal>

    <Modal
      v-model="deleteComfirmModal"
      title="确认删除"
      @on-cancel="deleteComfirmModal=false"
      @on-ok="doDeleteGoods">

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
      e:'',
      value1: ['1', ],
      showTag: true,
      showTagCompany: false,
      deleteGoodId: '',
      total:0,
      current:1,
      spin:false,
      searchStr:'',
      size:10,
      data1: [],
      categoryId:'',
      categoryId2: '',
      companyId: '',
      companyId2:'',
      categoryName:'',
      category: '',
      isOnSale: '',
      isOnShow: '',
      infoModal: false,
      deleteComfirmModal: false,
      info:{
        imgs:[]
      },
      sortMethod: '',
      sortMethodList: [
        {
          label: '默认',
          value: '0'
        },
        {
          label: '价格升序',
          value: '1'
        },
        {
          label: '价格降序',
          value: '2'
        }
      ],
      categoryList: [],
      companyList: [],
      saleList: [
        {
          label: '上架',
          value: '1'
        },
        {
          label: '下架',
          value: '0'
        }
      ],
      showList: [
        {
          label: '显示',
          value: '1'
        },
        {
          label: '隐藏',
          value: '0'
        }
      ],
      company: '',
      columns2: [
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '进货价',
          key: 'cost'
        },
        {
          title: '销售价',
          key: 'amount'
        },
        {
          title: '规格',
          key: 'spec'
        },
      ],
      data2:[],
      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '图片',
                     key: 'skuMedia',
                     render:(h,params)=>{
                        var imgSrc = params.row.url;

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
                     title: '销售价',
                     key: 'minPrice',
                     width: 80
                 },
                {
                  title: '进货价',
                  key: 'cost',
                  width: 80
                },
                {
                  title: '供应商',
                  key: 'companyName',
                },
                {
                  title: '下单要求',
                  key: 'orderRule',
                },
                {
                  title: '供应需求',
                  key: 'supplyRule',
                },
                {
                  title: '排序',
                  key: 'orderNumber',
                  width: 70
                },
                {
                  title: '发票类型',
                  key: 'invoice',
                },
                 {
                     title: '状态',
                     key: 'isOnSale',
                     render: (h, params) => {
                        var type = params.row.isOnSale==0 || params.row.isOnSale == null || params.row.isOnSale == 'null' ? 'error' : 'success';

                        var typeName = params.row.isOnSale==0 || params.row.isOnSale==null || params.row.isOnSale == 'null' ? '已下架' : '上架中';
                        var icon = params.row.isOnSale==0 || params.row.isOnSale==null || params.row.isOnSale == 'null' ? 'ios-arrow-thin-up' : 'ios-arrow-thin-down';

                       var type2 = params.row.isOnShow==0 || params.row.isOnShow==null || params.row.isOnShow=='null' ? 'dashed' : 'default';
                       var typeName2 = params.row.isOnShow==0 || params.row.isOnShow==null || params.row.isOnShow=='null'? '已隐藏' : '显示中';
                       var icon2 = params.row.isOnShow==0 || params.row.isOnShow==null || params.row.isOnShow=='null'? 'ios-arrow-thin-up' : 'ios-arrow-thin-down';

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
                             h('Button', {
                               props: {
                                 type: type2,
                                 size: 'small',
                                 shape: 'circle'
                               },
                               style: {
                                 marginRight: '5px'
                               },
                               on: {
                                 click: () => {
                                   this.$router.push('/goods/index/update/'+params.row.id);
                                 }
                               }
                             }, typeName2),
                             h('Button', {
                               props: {
                                 type: 'default',
                                 size: 'small',
                                 icon:icon2,
                               },
                               on: {
                                 click: () => {
                                   this.changeOnShow(params.row._index);
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
                       let cname = params.row.categoryName;
                       let companyName = params.row.companyName;
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
                                   let id = params.row.id ;
                                   this.showInfo(id);
                                 }
                               }
                             }, '查看'),
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
                                         let id = params.row.id ;
                                         let cid = '';
                                         if (this.showTag){
                                           cid = this.categoryId;
                                         } else
                                           cid = this.categoryId2;
                                       let companyId = '';
                                       if (this.showTagCompany){
                                         companyId = this.companyId;
                                       } else{
                                         companyId = this.companyId2;
                                       }
                                         this.$router.push({
                                           path: '/goods/index/update/'+id,
                                           query:{
                                             id: id,
                                             current: this.current,
                                             currentCategoryId: cid,
                                             currentCategoryName: cname,
                                             currentCompanyId: companyId,
                                             currentCompanyName: companyName
                                           },
                                         });
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


    if (this.$route.query.current){
      this.current = this.$route.query.current;
      this.categoryId = this.$route.query.currentCategoryId;
      this.categoryName = this.$route.query.currentCategoryName;
    }
    if(this.$route.query.currentCategoryId){
      this.categoryId = this.$route.query.currentCategoryId;
      this.categoryName = this.$route.query.currentCategoryName;
    }
    if (this.$route.query.currentCompanyId) {
      this.showTagCompany = true;
      this.companyId = this.$route.query.currentCompanyId;
      this.companyName = this.$route.query.currentCompanyName;
    }
    this.dataInit();

  },
  methods:{
    dataInit(){
      let p = 0;
      if (this.current != 0){
        p = this.current-1;
      }
      let cid = '';
      if (this.showTag){
        cid = this.categoryId;
      }else{
        cid = this.categoryId2;
      }

      let companyId = '';
      if (this.showTagCompany){
        companyId = this.companyId;
      } else{
        companyId = this.companyId2;
      }

      axios.get(URL+'product',{
        params:{
          page:p,
          size:this.size,
          key:this.searchStr,
          categoryId: cid,
          isOnSale: this.isOnSale == '1' ? true :this.isOnSale== '0'?false: null,
          isOnShow: this.isOnShow == '1' ? true :this.isOnShow== '0'?false: null,
          companyId: companyId == '' ? null:companyId
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
      this.getCategoryList(this.categoryId);
      this.getCompanyList();
    },
    getCompanyList(){
      axios.get(URL+'company/getSimpleCompanies',{
        params:{
          type: 'SUPPLY'
        }
      }).then(function(res){
        var datas = res.data.data;
        var list = new Array();
        datas.forEach(function(v,i,datas){
          var o = {
            label: v.companyName + ' ' + v.managerName,
            value: v.id
          };
          list.push(o);
        });
        this.companyList = list;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 获取类别
    getCategoryList(cid){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        var c = data.data;
        var cList = [];
        for(var i in data.data){
          var o = {
            categoryId: c[i].id,
            categoryName: c[i].name,
            categoryKey: c[i].id + c[i].name + i
          };
          cList.push(o);
        }
        this.categoryList = cList;
        if (!cid){
          this.showTag = false;
        }

      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },

    clear(){
      this.status = '';
      //this.categoryId = '';
      this.currentCategoryId = '';
      //this.categoryName = '';
      //this.showTag = false;
      this.sortMethod = '';
      this.searchStr = '';
      this.companyId = '';
      this.isOnSale = '';
      this.isOnShow = '';
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
      let cid = '';
      if (this.showTag){
        cid = this.categoryId;
      }else{
        cid = this.categoryId2;
      }
      let companyId = '';
      if (this.showTagCompany){
        companyId = this.companyId;
      } else{
        companyId = this.companyId2;
      }
      axios.get(URL+'product',{
        params:{
          page:n,
          size:this.size,
          key:this.searchStr,
          categoryId: cid,
          isOnSale: this.isOnSale == '1' ? true :this.isOnSale== '0'?false: null,
          isOnShow: this.isOnShow == '1' ? true :this.isOnShow== '0'?false: null,
          companyId: companyId == '' ? null:companyId
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
      let cid = '';
      if (this.showTag){
        cid = this.categoryId;
      }else{
        cid = this.categoryId2;
      }

      let companyId = '';
      if (this.showTagCompany){
        companyId = this.companyId;
      } else{
        companyId = this.companyId2;
      }

      axios.get(URL+'product',{
        params:{
          page:0,
          size:this.size,
          key:this.searchStr,
          categoryId: cid,
          isOnSale: this.isOnSale == '1' ? true :this.isOnSale== '0'?false: null,
          isOnShow: this.isOnShow == '1' ? true :this.isOnShow== '0'?false: null,
          companyId: companyId == '' ? null:companyId
        }
      }).then(function(res){
        var data = res.data.data;
        this.total = data.total;
        this.current = data.current+1;
        this.data1 = data.data;
        if (this.categoryName == ''){
          this.categoryList.forEach((value, index)=>{
            if (value.id = this.categoryId){
              this.categoryName = value.name;
            }
          })
        }
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
    changeOnShow(index){
      var onshow = 0;
      var id = this.data1[index].id;
      if(this.data1[index].isOnShow==1){
        this.data1[index].isOnShow = 0;
        onshow = 0;
      }else{
        this.data1[index].isOnShow = 1;
        onshow = 1;
      }
      var params = new URLSearchParams();
      params.append('onshow',onshow);
      axios.post(URL+'product/onShow/'+id,params).then(function(res){
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
      this.deleteGoodId = id;
      this.deleteComfirmModal = true;
    },
    doDeleteGoods(){
      let id = this.deleteGoodId;
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
    },
    showInfo(id){
      axios.get(URL+'product/'+id).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.info = res.data.data;
          //this.data2 = this.info.skus;
          var skus = this.info.skus;
          skus.forEach((v,i)=>{
            var p = v.productOption;
            var s = '';
            p.forEach((o, ii)=>{
              s += o.attributeName + ": " + o.attributeValue;
            });
            v.spec = s;
          });
          this.data2 = this.info.skus;
        }
      }.bind(this)).catch(function(error){
      }.bind(this));
      this.infoModal = true;
    },
    handleClose(){
      this.showTag = false;
      this.categoryId = '';
      //this.categoryName = '';
    },
    handleCloseCompany(){
      this.showTagCompany = false;
      this.companyId = '';
      this.companyName = '';
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
