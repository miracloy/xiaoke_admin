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
          <DatePicker type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" v-model="date" format="yyyy-MM-dd" @on-change="dateChange" @on-clear="dataClear"></DatePicker>
          <Input v-model="searchStr" icon="ios-search" placeholder="公司名称/负责人手机号" style="width: 200px"></Input>
          <Button type="primary" @click="search">查询</Button>
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

    <Spin class="demo-spin-col" v-if="spin">
        <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>
    
    <!-- 新增补充信息 -->
    <Modal
        v-model="fulliBillInfo_modal"
        title="补齐清单信息"
        @on-cancel="fulliBillInfo_modal=false" class="info">
    
        <Row>
          <Col span="6">
              <p class="margin-10">订单名称</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Input v-model="fulliBillInfo_data.name" style="width: 300px"></Input>
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">配送时间</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <TimePicker format="HH:mm" type="timerange" placement="bottom-end" placeholder="Select time" style="width: 168px" v-model="full_date"  @on-change="fullDateChange"></TimePicker>
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">订单类型</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <Select v-model="fulliBillInfo_data.orderType" style="width:200px">
                    <Option v-for="item in fulliBillInfo_data_orderType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">套餐类型</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <RadioGroup v-model="fulliBillInfo_data.packageType">
                    <Radio label="SINGLE">单人份</Radio>
                    <Radio label="SHARE">分享装</Radio>
                </RadioGroup>
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">人数</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <InputNumber :max="10000" :min="1" v-model="fulliBillInfo_data.num"></InputNumber>
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p v-if="fulliBillInfo_data.packageType=='SINGLE' " class="margin-10">人均消费水平</p>
              <p v-else class="margin-10">总金额</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                <InputNumber :max="1000000" :min="1" v-model="fulliBillInfo_data.price"></InputNumber>
              </p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">下单时间</p>
          </Col>
          <Col span="18">
              <p class="margin-10">
                 <DatePicker type="date" multiple placeholder="Select date" style="width: 300px" @on-change="OrderDateChange"></DatePicker>
              </p>
          </Col>
        </Row>

        <div slot="footer">
          <Button type="primary" @click="fulliBillInfo">确认</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate,_timestrToHs,_strToTime} from '@/api/common.js'
export default {
  data () {
    return {
      fulliBillInfo_data_orderType:[
        {label:'下午茶',value:'AFTERNOON'},
        {label:'生日活动',value:'BIRTHDAY'},
        {label:'早点',value:'BREAKFAST'},
        {label:'日常福利',value:'DAIILYWELFARE'},
        {label:'夜宵',value:'SUPPER'},
        {label:'其他',value:'OTHER'},
      ],
      full_date:'',
      fulliBillInfo_data:{
        id:'',
        name:'',
        startTs:'',
        endTs:'',
        orderType:'AFTERNOON',
        packageType:'SINGLE',
        num:1,
        price:1,
        orderTs:'',
      },
      fulliBillInfo_modal:false,
      newUser:{
        company:'',
        name:'',
        phone:'',
        address:'',
        credit:0,
        area:''
      },
      date:'',
      total:0,
      size:10,
      current:1,
      spin:false,
      searchStr:'',
      startTs:'',
      endTs:'',
      data1: [],
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
                     title: '任务类型',
                     key: 'submitType',
                     render:(h,params)=>{
                      var isPendStr = params.row.submitType==0 ? '发清单' : '直接下单';
                      return h('Button',{
                          props:{
                            type: 'default',
                            size: 'small',
                          },
                        },isPendStr);
                     }
                 },
                 {
                     title: '清单类型',
                     key: 'orderType',
                     render:(h,params)=>{
                      if(!params.row.orderType) return '';
                      return params.row.orderType.friendlyType;
                     }
                 },
                 {
                     title: '套餐类型',
                     key: 'packageType',
                     render:(h,params)=>{
                      if(!params.row.packageType) return '';
                      if(params.row.packageType.type=='SINGLE'){
                        return params.row.packageType.friendlyType+'('+params.row.num+')';
                      }
                      return params.row.packageType.friendlyType;
                     }
                 },
                 {
                     title: '金额',
                     key: 'orderType',
                     render:(h,params)=>{
                      if(!params.row.packageType && !params.row.price) return '';
                      if(params.row.packageType.type=='SINGLE'){
                        var str = '人均:'+ params.row.price;
                        return str;
                      }else{
                        return params.row.detailtotal;
                      }
                     }
                 },
                 {
                     title: '下单时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                      return _timestrToDate(params.row.createdAt);
                     }
                 },
                 {
                     title: '清单状态',
                     key: 'isPend',
                     render:(h,params)=>{
                      var isPendStr = params.row.isPend==0 ? '未处理' : '已处理';
                      return h('Button',{
                          props:{
                            type: 'default',
                            size: 'small',
                          },
                        },isPendStr);
                     }

                 },
                 {
                     title: '当日配送时间',
                     key: 'endTs',
                     render:(h,params)=>{
                      if(params.row.endTs){
                        return _timestrToHs(params.row.endTs);
                      }else{
                        return '';
                      }
                     }
                 },
                 {
                     title: '备注',
                     key: 'remarks',
                     render:(h,params)=>{
                      return h('Button',{
                          props:{
                            type: 'info',
                            size: 'small',
                          },
                          on:{
                            click:()=>{
                              this.show(params.index);
                            }
                          }
                        },'查看');
                     }
                 },
                 {
                     title: '清单详情',
                     key: 'handle',
                     render:(h,params)=>{
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        if(params.row.orderType){
                                          this.$router.push('/bill/index/detail/'+params.row.id);
                                        }else{
                                          this.fulliBillInfo_modal = true;
                                          this.fulliBillInfo_data.id = params.row.id;
                                        }
                                    }
                                }
                            }, '清单处理'),
                        ]);
                     }
                 },
                 {
                     title: '操作',
                     key: 'action',
                     width: 100,
                     align: 'center',
                     render: (h, params) => {
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
                                         this.billDel(params.index);
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
      axios.get(URL+'list',{
        params:{
          page:0,
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
    updateInit(){
      axios.get(URL+'list',{
        params:{
          page:this.current-1,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
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
      axios.get(URL+'list',{
        params:{
          page:n,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
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
    dateChange(e){
      this.startTs=Date.parse(new Date(e[0]));
      this.endTs=Date.parse(new Date(e[1]));
    },
    dataClear(){
      this.startTs = '';
      this.endTs = '';
    },
    search(){
      axios.get(URL+'list',{
        params:{
          page:0,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
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
    show(index) {
        this.$Modal.info({
            title: '详细信息',
            content: `备注：${this.data1[index].remarks}<br>`
        })
    },
    add(){

    },
    billDel(index){
      var id = this.data1[index].id;
      axios.delete(URL+'list/'+id)
      .then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('删除成功');
          this.updateInit();
        }    
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    // 订单信息补充
    fulliBillInfo(){
      var params = new URLSearchParams();
      params.append('name', this.fulliBillInfo_data.name);
      params.append('startTs', this.fulliBillInfo_data.startTs);
      params.append('endTs', this.fulliBillInfo_data.endTs);
      params.append('orderType', this.fulliBillInfo_data.orderType);
      params.append('packageType', this.fulliBillInfo_data.packageType);
      params.append('num', this.fulliBillInfo_data.num);
      params.append('price', this.fulliBillInfo_data.price);
      params.append('orderTs',  _strToTime(this.fulliBillInfo_data.orderTs) );
      params.append('id', this.fulliBillInfo_data.id);

      axios.post(URL+'list/fullBillInfo',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.$router.push('/bill/index/detail/'+this.fulliBillInfo_data.id);
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    fullDateChange(e){
      this.fulliBillInfo_data.startTs = e[0];
      this.fulliBillInfo_data.endTs = e[1];
    },
    OrderDateChange(e){
      this.fulliBillInfo_data.orderTs = e;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
