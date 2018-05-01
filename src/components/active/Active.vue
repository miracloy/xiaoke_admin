<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
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
        v-model="activeModal"
        title="发放代金券"
        @on-cancel="activeModal=false">
    
        <Row>
          <Col span="6">
              <p class="margin-10">使用者</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.group ? info.group.companyName : ''}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">邀请人</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.invitedBy}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">公司规模</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.group ? info.group.scale : ''}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">订单编号</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.orderNumber}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">发放金额</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
              <InputNumber :max="100000" :min="0" v-model="rewardMoney"></InputNumber> 元
              </p>
          </Col>
        </Row>

        <div slot="footer">
            <Button type="default"  @click="activeModal=false">取消</Button>
            <Button type="primary"  @click="activeAdd">提交</Button>
        </div>
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
      total:0,
      current:1,
      spin:false,
      searchStr:'',
      size:10,
      data1: [],
      info:{},
      activeModal:false,
      rewardMoney:0,//发放金额
      columns1: [
                 {
                     title: '编号',
                     key: 'id'
                 },
                 {
                     title: '名称',
                     key: 'name',
                 },
                 {
                     title: '用户',
                     key: 'owner',
                 },
                 {
                     title: '邀请人',
                     key: 'invitedBy',
                 },
                 {
                     title: '创建日期',
                     key: 'createdAt',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.createdAt);
                     }
                 },
                 {
                     title: '截止日期',
                     key: 'expirationDate',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.expirationDate);
                     }
                 },
                 {
                     title: '是否有效',
                     key: 'ticketStatus',
                     render:(h, params) => {
                        if(params.row.ticketStatus){
                          return "是";
                        }else{
                          return "否";
                        }
                     }
                 },
                 {
                     title: '是否已经使用',
                     key: 'ifUsed',
                     render:(h, params) => {
                        if(params.row.ifUsed){
                          return "未使用";
                        }else{
                          return '已使用';
                        }
                     }
                 },
                 {
                     title: '订单状态',
                     key: 'status',
                     render:(h,params) =>{
                      if(params.row.status.friendlyType){
                        return params.row.status.friendlyType;
                      }else{
                        return '';
                      }
                     }
                 },
                 {
                     title: '代金券是否发放',
                     key: 'rewardMoney',
                     render:(h, params) => {
                        if(params.row.rewardMoney){
                          return "是";
                        }else{
                          return "否";
                        }
                     }
                 },
                 {
                     title: '发放代金券',
                     key: 'rewardMoney',
                     align: 'center',
                     render: (h, params) => {
                         if(params.row.rewardMoney){
                          return params.row.rewardMoney;
                         }else if(params.row.owner && params.row.invitedBy && params.row.status.friendlyType=='已完成' && !params.row.status){
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
                                          this.showActiveModel(params.row.id);
                                      }
                                  }
                              }, '发放'),
                          ]);
                         }else{
                          return "不能发放";
                         } 
                     }
                 },
                 {
                    title:'操作',
                    key:'action',
                    align:'center',
                    render:(h,params) => {
                      if(params.row.ticketStatus){
                        var type = 'error';
                        var typeName = '禁用';
                      }else{
                        var type = 'success';
                        var typeName = '启用';
                      }
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
                                    this.onOrOff(params.row.id,params.row.ticketStatus);

                                  }
                              }
                          }, typeName),
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
      axios.get(URL+'specialActivity',{
        params:{
          page:0,
          size:this.size,
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
      axios.get(URL+'specialActivity',{
        params:{
          page:this.current-1,
          size:this.size,
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
      axios.get(URL+'specialActivity',{
        params:{
          page:n,
          size:this.size,
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
      this.ticketId = id;
      axios.get(URL+'specialActivity/ticket/'+id,{}).then(function(res){
        var data = res.data.data;
        this.info = data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 发放
    activeAdd(){
      var params = new URLSearchParams();
      params.append('ticketId', this.ticketId);
      params.append('rewardMoney', this.rewardMoney);

      axios.post(URL+'specialActivity/sendRewardMoney',params).then(function(res){
       if(res.data.errorCode!=200){
         this.$Message.error(res.data.moreInfo);
       }else{
         this.updateInit();
         this.activeModal = false;
         this.$Message.success('请求成功');
       }
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 禁用或启动
    onOrOff(id,status){
      var params = new URLSearchParams();
      params.append('status', !status);

      axios.post(URL+'specialActivity/ticketStatus/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.updateInit();
          this.$Message.success('请求成功');
        }
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
