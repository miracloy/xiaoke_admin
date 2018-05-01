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
          <Select v-model="status" @on-change="statusChange" style="width:100px" placeholder="是否完成">
              <Option v-for="item in statusSelect" :value="item.value" :key="item.value" >{{ item.label }}</Option>
          </Select>
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
        title="确认发放"
        @on-ok="giveOut"
        @on-cancel="showModal=false">
        <p style="text-align:center;">是否确认发放 ? </p>
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
      statusSelect: [
                  {
                      value: '',
                      label: '全部'
                  },
                  {
                      value: 'false',
                      label: '未完成'
                  },
                  {
                      value: 'true',
                      label: '已完成'
                  },
              ],
      give_id:'',
      showModal:false,
      total:0,
      current:1,
      spin:false,
      status:'',
      searchStr:'',
      size:10,
      data1: [],
      info:{},
      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '用户',
                     key: 'owner',
                 },
                 {
                     title: '公司名称',
                     key: 'group',
                     render:(h,params)=>{
                        return params.row.group.companyName;
                     }
                 },
                 {
                     title: '公司地址',
                     key: 'group',
                     render:(h,params)=>{
                        return params.row.group.address;
                     }
                 },
                 {
                     title: '联系电话',
                     key: 'group',
                     render:(h,params)=>{
                        return params.row.group.phoneNumber;
                     }
                 },
                 {
                     title: '公司规模',
                     key: 'group',
                     render:(h,params)=>{
                        return params.row.group.scale;
                     }
                 },
                 {
                     title: '申请日期',
                     key: 'createdAt',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.createdAt);
                     }
                 },
                 {
                     title: '产品编号',
                     key: 'productId',
                 },
                 {
                     title: '产品名称',
                     key: 'productName',
                 },
                 {
                     title: '兑换金额',
                     key: 'price',
                 },
                 {
                    title:'发放商品',
                    key:'action',
                    align:'center',
                    render:(h,params) => {
                      if(params.row.finished){
                        return "已发放";
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
                                      this.give_id = params.row.id;
                                      this.showModal = true;
                                    }
                                }
                            }, '发放'),
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
      axios.get(URL+'specialActivity/getConvertedProduct',{
        params:{
          page:0,
          size:this.size,
          finished:this.status
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
    },
    updateInit(){
      axios.get(URL+'specialActivity/getConvertedProduct',{
        params:{
          page:this.current-1,
          size:this.size,
          finished:this.status
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
      axios.get(URL+'specialActivity/getConvertedProduct',{
        params:{
          page:n,
          size:this.size,
          finished:this.status
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
    showActiveModel(id){
      this.activeModal = true;
      axios.get(URL+'specialActivity/ticket/'+id,{}).then(function(res){
        var data = res.data.data;
        this.info = data;
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
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
