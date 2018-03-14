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
          <DatePicker type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" v-model="date"></DatePicker>
          <Input v-model="payway" icon="ios-search" placeholder="付款方式" style="width: 200px"></Input>
          <Button type="primary" @click="search">查询</Button>
        </div>
      </Col>
      <Col span="2" offset="4">
        <div class="addBox">
          <Button type="info" icon="plus" >导出Excel文件</Button>
        </div>
      </Col>
    </Row>
    
    <div class="layout-content-main">
     <Table stripe border highlight-row :columns="columns1" :data="data1"></Table>
     <div class="footer-box">
     	 <div class="finance-box">
     	 	<p>消费总金额 : 10000</p>
     	 	<p>总未结账款 : 1000</p>
     	 </div>
         <div class="page-box">
             <Page :total="total" :current="current" @on-change="changePage"></Page>
         </div>
     </div>
    </div>

    <Modal
        v-model="checkModal"
        title="结款"
        @on-ok="check"
        @on-cancel="checkModal=false">
        <p class="margin-10">此笔消费未结清金额 &nbsp;&nbsp;&nbsp;&nbsp; ￥ 1500</Input></p>
        <p class="margin-10">结款金额 &nbsp;&nbsp;&nbsp;&nbsp;<InputNumber :max="1000000" :min="0" v-model="checkfund"></InputNumber></p>
    </Modal>


  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
export default {
  data () {
    return {
      date:'',
      total:0,
      current:1,
      spin:false,
      company:'',
      payway:'',
      checkfund:0,
      checkModal:false,
      data1: [],
      columns1: [
                 {
                     title: '编号',
                     key: 'no'
                 },
                 {
                     title: '公司名称',
                     key: 'company'
                 },
                 {
                     title: '负责人姓名',
                     key: 'person',
                 },
                 {
                     title: '负责人手机号',
                     key: 'phone',
                 },
                 {
                     title: '地区',
                     key: 'area',
                 },
                 {
                     title: '信用额度',
                     key: 'credit',
                 },
                 {
                     title: '消费金额',
                     key: 'consume',
                 },
                 {
                     title: '未结账款',
                     key: 'unfinishAccount',
                 },
                 {
                     title: '付款方式',
                     key: 'payway',
                 },
                 {
                     title: '时间',
                     key: 'time',
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
                                         this.checkModal = true;
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
    // axios.get(URL+'order/paginate',{
    //   'token':'1111'
    // }).then(function(res){
    //   var data = res.data;
    //   this.total = data.total;
    //   this.current = data.current_page;
    //   this.data1 = data.data;
    // }.bind(this)).catch(function(error){
    //   console.log(error);
    // });
      
      this.total = 1;
      this.current = 1;
      this.data1 = [
      	{no:'2323245221',company:'帮呗科技',person:'王浩霖',phone:'18685241147',area:'江干',credit:10000,consume:500,unfinishAccount:0,payway:'微信',time:'2017-10-14 10:20:21'}
      ];
  },
  methods:{
    changePage(n){
      // this.spin = true;
      // axios.get(URL+'order/paginate?page='+n)
      //   .then(function(res){
      //     var data = res.data;
      //     this.total = data.total;
      //     this.current = data.current_page;
      //     this.data1 = data.data;
      //     this.spin = false;
      // }.bind(this)).catch(function(error){
      //   console.log('error');
      // });
    },
    check(){

    },
    search(){
    	
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-box{
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
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
