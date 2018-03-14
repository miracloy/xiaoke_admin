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
      <Col span="2" offset="8">
        <div class="addBox">
          <Button type="info" icon="plus" ><router-link tag="span" to="/bill/index/billpushadd">新增清单</router-link></Button>
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

  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate,_timestrToHs} from '@/api/common.js'
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
                    title:'清单名',
                    key:'detailName'
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
                     title: '下单时间',
                     key: 'createdAt',
                     render:(h,params)=>{
                      return _timestrToDate(params.row.createdAt);
                     }
                 },
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
      axios.get(URL+'list/zijian',{
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
    changePage(n){
      n = n-1;
      axios.get(URL+'list/zijian',{
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
      axios.get(URL+'list/zijian',{
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

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
