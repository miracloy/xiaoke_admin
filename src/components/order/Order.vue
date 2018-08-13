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
          <Select v-model="status" @on-change="statusChange" style="width:100px" placeholder="订单状态">
              <Option v-for="item in statusSelect" :value="item.value" :key="item.value" >{{ item.label }}</Option>
          </Select>
          <Button type="primary" @click="search">查询</Button>
        </div>
      </Col>
      <Col span="2" offset="8">
        <div class="addBox">
          <Button type="info" icon="plus" @click="exportData">导出Excel文件</Button>
        </div>
      </Col>
    </Row>

    <div class="layout-content-main">
     <Table stripe border highlight-row :columns="columns1" :data="data1" size="small" ref="table"></Table>
     <div style="margin: 10px;overflow: hidden">
         <div style="float: right;">
             <Page :total="total" :current="current" @on-change="changePage" :page-size="size"></Page>
         </div>
     </div>
    </div>

    <Modal
        v-model="infoModal"
        title="订单详情"
        @on-cancel="infoModal=false" class="info">

        <Row>
          <Col span="6">
              <p class="margin-10">订单名称</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.name}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">订单状态</p>
          </Col>
          <Col span="18">
              <p class="margin-10" v-if="info.status">{{info.status.friendlyType}}</p>
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
              <p class="margin-10">总金额</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.amount}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">订单所含商品</p>
          </Col>
          <Col span="18">
              <Row v-for="v in info.orderItems" :key="v.id">
                <Col span="4" style="text-align:center;"><img style="width:80%;" v-if="v.skuMedia.primary" :src="v.skuMedia.primary.url"></Col>
                <Col span="4" style="text-align:center;">{{v.name}}</Col>
                <Col span="8">
                  <p v-for="v1 in v.productOption" style="text-align:center;">{{v1.attributeValue}}</p>
                </Col>
                <Col span="4" style="text-align:center;">{{v.quantity}}</Col>
                <Col span="4" style="text-align:center;">{{v.amount}}</Col>
              </Row>
              <Row>
                <Col span="8" offset="14" style="border:1px solid #ccc;padding:5px;border-radius:5px;">总计：￥{{info.amount}}</Col>
              </Row>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">顾客需求</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.reason}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">配送时间</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.deliveryDate}}</p>
          </Col>
        </Row>
        <Row>
          <Col span="6">
              <p class="margin-10">配送地址</p>
          </Col>
          <Col span="18">
              <p class="margin-10">{{info.addressDetail}}</p>
          </Col>
        </Row>
        <div slot="footer">
          <Button type="primary" @click="print(info.id)">打印订单</Button>
        </div>
    </Modal>

    <Modal v-model="delModal" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>删除确认</span>
        </p>
        <div style="text-align:center">
            <p>数据删除后不可恢复，请谨慎操作</p>
            <p>是否继续删除？</p>
        </div>
        <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button>
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
      statusSelect: [
                  {
                      value: '',
                      label: '全部'
                  },
                  {
                      value: 'SHIPPED',
                      label: '待配送'
                  },
                  {
                      value: 'FINISHED',
                      label: '已完成'
                  },
                  {
                      value: 'CANCELLED',
                      label: '已取消'
                  },
              ],
      spin:false,
      modal_loading:false,
      delModal:false,
      infoModal:false,
      date:'',
      total:0,
      size:10,
      current:1,
      searchStr:'',
      startTs:'',
      status:'',
      endTs:'',
      info:[],
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
                     title: '订单号',
                     key: 'orderNumber',
                 },
                 {
                     title: '金额',
                     key: 'amount',
                 },
                 {
                     title: '订单状态',
                     key: 'status',
                     render:(h,params)=>{
                        return params.row.status.friendlyType;
                     }
                 },
                 {
                 	title:'下单时间',
                 	key:'createdAt',
                  render:(h,params)=>{
                   return _timestrToDate(params.row.createdAt);
                  }
                 },
                 {
                     title: '配送时间',
                     key: 'deliveryDate',
                     render:(h,params)=>{
                      return _timestrToDate(params.row.deliveryDate);
                     }
                 },
                 {
                     title: '配送地址',
                     key: 'addressDetail',
                 },
                 {
                     title: '订单详情',
                     key: 'info',
                     render:(h,params)=>{
                     	return h('Button',{
                     		props:{
                     			type:'info',
                     			size:'small'
                     		},
                     		on:{
                     			click:()=>{
                            this.showInfo(params.row.id);
                     			}
                     		}
                     	},'订单查看');
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
                                     type: 'warning',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.cancel(params.index);
                                     }
                                 }
                             }, '拒绝'),
                             h('Button', {
                                 props: {
                                     type: 'success',
                                     size: 'small'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 on: {
                                     click: () => {
                                         this.delivery(params.index);
                                     }
                                 }
                             }, '完成配送'),
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
                                         this.remove(params.index);
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
    this.spin = true;
    axios.get(URL+'order',{
      params:{
        page:0,
        size:this.size,
      }
    }).then(function(res){
      if(res.data.errorCode==401){
        this.$Message.error('登录超时,请重新登录');
        setTimeout(()=>{
          this.$router.replace('/login');
        },2000);
      }
      var data = res.data.data;
      this.total = data.total;
      this.current = data.current+1;
      this.data1 = data.data;
      this.spin = false;
    }.bind(this)).catch(function(error){
      console.log(error);
    });
  },
  methods:{
    changePage(n){
      n = n-1;
      this.spin = true;
      axios.get(URL+'order',{
        params:{
          page:n,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
          status:this.status,
        }
      }).then(function(res){
          var data = res.data.data;
          this.total = data.total;
          this.current = data.current+1;
          this.data1 = data.data;
          this.spin = false;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    search(){
      axios.get(URL+'order',{
        params:{
          page:0,
          size:this.size,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
          status:this.status,
        }
      }).then(function(res){
          var data = res.data.data;
          this.total = data.total;
          this.current = data.current+1;
          this.data1 = data.data;
          this.$Message.success('查询成功');
        }.bind(this)).catch(function(res){
          this.$Message.error('查询请求失败');
        }.bind(this));
    },
    remove (index) {
      this.del_index = index;
      this.delModal = true;
    },
    del(){
      this.modal_loading = true;
      var id  = this.data1[this.del_index].id;

      axios.delete(URL+'order/'+id).then(function(res){
        this.data1.splice(this.del_index,1);

        this.modal_loading = false;
        this.delModal = false;
        this.del_index = null;
        this.$Message.success('删除成功');
      }.bind(this)).catch(function(res){
        this.$Message.error('删除失败');
      }.bind(this));
    },
    showInfo(id){
      this.spin = true;
      axios.get(URL+'order/'+id)
        .then(function(res){
          var data = res.data;
          this.info =data.data;
          debugger;
          this.info.deliveryDate = _timestrToDate(this.info.deliveryDate);
          this.spin = false;
          this.infoModal = true;
      }.bind(this)).catch(function(error){
        this.$Message.error('获取详情失败');
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
      this.fv = e;
    },
    cancel(index){
      var id  = this.data1[index].id;
      this.spin = true;
      axios.delete(URL+'order/cancel/'+id)
        .then(function(res){
          if(res.data.errorCode==200){
            this.data1[index].status.friendlyType = '已取消';
            this.$Message.success('取消成功');
          }else{
            this.$Message.error(res.data.moreInfo);
          }
          this.spin = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));
    },
    delivery(index){
      var id  = this.data1[index].id;
      this.spin = true;
      axios.put(URL+'order/delivery/'+id)
        .then(function(res){
          if(res.data.errorCode==200){
            this.data1[index].status.friendlyType = '订单结束';
            this.$Message.success('配送成功');
          }else{
            this.$Message.error(res.data.moreInfo);
          }
           this.spin = false;
      }.bind(this)).catch(function(error){
        this.$Message.error('请求失败');
      }.bind(this));
    },
    exportData(){
      if(this.startTs==''){
        this.$Message.error('请选择导出时间');
        return;
      }
      this.spin = true;
      axios.get(URL+'order',{
        params:{
          page:0,
          startTs:this.startTs,
          endTs:this.endTs,
          companyName:this.searchStr,
          status:this.status,
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
              data.deliveryDate = _timestrToDate(data.deliveryDate);
              data.status = data.status.friendlyType;
              return data;
            })
          });
          this.spin = false;
        }.bind(this)).catch(function(res){
          this.$Message.error('查询请求失败');
        }.bind(this));
    },
    print(id){
      window.open('./print.html?id='+id);
      this.infoModal = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
