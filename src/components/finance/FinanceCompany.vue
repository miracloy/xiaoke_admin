<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>
    <Row class="margin-10">
      <Col span="16">
        <div class="searchBox addBox">
          <DatePicker type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" v-model="date" format="yyyy-MM-dd" @on-change="dateChange" @on-clear="dataClear"></DatePicker>
          <Input v-model="searchStr" icon="ios-search" placeholder="公司名称" style="width: 200px"></Input>
          <Button type="primary" @click="search">查询</Button>
        </div>
      </Col>
      <Col span="2" offset="4">
        <div class="addBox">
          <Button type="info" icon="plus" @click="exportData">导出Excel文件</Button>
        </div>
      </Col>
    </Row>
    
    <div class="layout-content-main">
     <Table stripe border highlight-row :columns="columns1" :data="data1" ref="table"></Table>
     <div style="margin: 10px;overflow: hidden">
         <div style="float: right;">
             <Page :total="total" :current="current" @on-change="changePage"></Page>
         </div>
     </div>
     <!-- <div class="footer-box">
       <div class="finance-box">
        <p>消费总金额 : 10000</p>
        <p>总未结账款 : 1000</p>
        <p>总公司数 : 2</p>
       </div>
         <div class="page-box">
             <Page :total="total" :current="current" @on-change="changePage"></Page>
         </div>
     </div> -->
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
                     title: '消费金额',
                     key: 'amount',
                 },
                 {
                     title: '创建时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.createdAt);
                     }
                 },
                 {
                     title: '结算时间',
                     key: 'settleTs',
                     render:(h,params)=>{
                        return _timestrToDate(params.row.settleTs);
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
                                     type: 'info',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.check(params.index);
                                     }
                                 }
                             }, '结款'),
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
      axios.get(URL+'finance/cycle',{
        params:{
          page:0,
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
    updateInit(){
      axios.get(URL+'finance/cycle',{
        params:{
          page:tihs.current-1,
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
      axios.get(URL+'finance/cycle',{
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
    statusChange(e){
      this.status = e;
    },
    search(){
      axios.get(URL+'finance/cycle',{
        params:{
          page:0,
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
        console.log('error');
      });
    },
    exportData(){
      if(this.startTs==''){
        this.$Message.error('请选择导出时间');
        return;
      }
      axios.get(URL+'finance/cycle',{
        params:{
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
        }
      }).then(function(res){
          var data = res.data.data;
          this.csv = data.data;
          // 导出Excel文件
          this.$refs.table.exportCsv({
            filename: 'data',
            columns: this.columns1,
            data: this.csv.filter((data, index) => {
              data.createdAt = _timestrToDate(data.createdAt);
              data.settleTs = _timestrToDate(data.settleTs);
              return data;
            })
          });
        }.bind(this)).catch(function(res){
          this.$Message.error('导出失败');
        }.bind(this));
    },
    check(index){
      var id = this.data1[index].id;
      axios.put(URL+'finance/cycleLog?logIds='+id)
          .then(function(res){
          if(res.data.errorCode!=200){
            this.$Message.error(res.data.moreInfo);
          }else{
            this.$Message.success('销账成功');
            this.updateInit();
          }
      }.bind(this)).catch(function(error){
        this.$Message.error('销账失败');
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-box{
  margin-top: 10px;
  height: 80px;
}
.page-box{
  float: right;
}
.finance-box{
  width: 300px;
  float: left;
  text-indent: 10px;
}
.finance-box p{
  width: 150px;
  float: left;
  line-height: 40px;
  height: 40px;
  font-size: 14px;
}
</style>
