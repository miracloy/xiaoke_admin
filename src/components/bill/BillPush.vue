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

    <Modal
      v-model="infoModal"
      title="查看"
      width="1200px"
      @on-cancel="infoModal=false">
      <Collapse v-model="value1" simple>
        <Panel name="1">
          基础信息
          <p slot="content">
              <Row>
                <Col span="4">
                <p class="margin-10">清单名称：</p>
                </Col>
                <Col span="6">
                <p class="margin-10">{{info.name}}</p>
                </Col>
                <Col span="4">
                <p class="margin-10">用户：</p>
                </Col>
                <Col span="6">
                <p class="margin-10">{{info.user}}</p>
                </Col>
              </Row>
            <Row>
              <Col span="4">
              <p class="margin-10">配送日期：</p>
              </Col>
              <Col span="6">
              <p class="margin-10">{{info.deliveryDate}}</p>
              </Col>
            </Row>
            <Row>
              <Col span="4">
              <p class="margin-10">配送地址：</p>
              </Col>
              <Col span="6">
              <p class="margin-10">{{info.address}}</p>
              </Col>
            </Row>
            <Row>
              <Col span="4">
              <p class="margin-10">结款方式：</p>
              </Col>
              <Col span="6">
              <Tag color="orange">{{info.payMethod}}</Tag>
              </Col>
              <Col span="4">
              <p class="margin-10">开票信息：</p>
              </Col>
              <Col span="6">
              <ul v-for="(item, index) in info.invoices">
                <Tag>{{item}}</Tag>
              </ul>

              </Col>
            </Row>
            <Row>
              <Col span="4">
              <p class="margin-10">任务描述：</p>
              </Col>
              <Col span="6">
              <p class="margin-10">{{info.describe}}</p>
              </Col>
              <Col span="4">
              <p class="margin-10">备注：</p>
              </Col>
              <Col span="6">
              <p class="margin-10">{{info.remarks}}</p>
              </Col>
            </Row>
            <Row>
              <Col span="4">
              <p class="margin-10">清单转订单：</p>
              </Col>
              <Col span="6">
              <p class="margin-10">{{info.intervalInt}}</p>
              </Col>
            </Row>
          </p>
        </Panel>
        <Panel name="2">
          商品组
          <p slot="content">
          <table class="table" style="width: 1000px;">
            <tr>
              <td>图片</td>
              <td>名称</td>
              <td>供应商</td>
              <td>发票</td>
              <td>下单需求</td>
              <td>供应需求</td>
              <td>规格</td>
              <td>数量</td>
              <td>单价</td>
              <td>合计</td>

            </tr>
            <tr v-for="(v,i) in listcarts">
              <td><img v-if="v.img" :src="v.img" style="height:40px;"></td>
              <td>{{v.name}}</td>
              <td>{{v.companyName}}</td>
              <td>{{v.invoice}}</td>
              <td>{{v.orderRule}}</td>
              <td>{{v.supplyRule}}</td>

              <td>
                {{v.spec}}
              </td>
              <td>{{v.quantity}}</td>
              <td>{{v.skuPrice}}</td>
              <td>{{v.totoalPrice.amount}}</td>
            </tr>
            <tr>
              <td colspan="9"> </td>
              <td>{{listcarts_totalPrice}}</td>
            </tr>
          </table>
          </p>
        </Panel>
      </Collapse>
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
        <Button type="error" size="large" long @click="dodel">删除</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
import {_timestrToDate,_timestrToHs} from '@/api/common.js'
export default {
  data () {
    return {
      infoModal: false,
      delModal: false,
      value1:['1','2','3'],
      info:{},
      listcarts:[],
      listcarts_totalPrice: 0,
      delId: '',
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
                      return h('span', _timestrToDate(params.row.createdAt));
                     }
                 },
                {
                  title: '是否已处理',
                  key: 'isPend',
                  render:(h,params)=>{
                    let pend = params.row.isPend;
                    let i = h('Icon',{
                      props:{
                        type:'ios-checkmark'
                      }},'是');
                    let i2 = h('Icon',{
                      props:{
                        type:'md-close'
                      }},'是');
                    let w1 = h('span', '是');
                    let w2 = h('span', '否');

                    if (pend){
                      return h('div',[i,w1]);
                    } else {
                      return h('div',[i2,w2]);
                    }
                  }
                },
                {
                  title: '操作',
                  key: 'cc',
                  render:(h,params)=>{
                    var del = h('Button', {
                      props: {
                        size: 'small',
                        shape: 'circle',
                        type: 'error'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.del(params.row.id);
                          //this.$router.push('/goods/index/update/'+params.row.id);
                        }
                      }
                    }, '删除');
                    var info = h('Button', {
                      props: {
                        size: 'small',
                        shape: 'circle'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.infoMOdal(params.row.id);
                          //this.$router.push('/goods/index/update/'+params.row.id);
                        }
                      }
                    }, '查看');
                    return h('div',[del,info]);
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
    infoMOdal(id){
      this.infoModal = true;
      this.getBillInfo(id);
    },
    getBillInfo(id){
      axios.get(URL+'list/' + id,{
        params:{
          id:id
        }
      })
        .then(function(res){
          this.info = res.data.data;
          if (this.info.addressLine != null){
            this.info.address = this.info.addressLine;
          }else if (this.info.addressDetail != null ){
            this.info.address = this.info.addressDetail;
          }
          this.info.deliveryDate = _timestrToDate(this.info.deliveryDate);
          let invoices = this.info.invoices;
          var i = new Array();
          invoices.forEach((value, index,invoices)=>{
            i.push(value.title);
          });
          this.info.invoices = i;
          let int = this.info.intervalInt;
          if (int == -1){
            this.info.intervalInt = '不自动转订单';
          } else if (int > 1){
            this.info.intervalInt =  int+'小时后自动转订单';
          } else if (int == 0){
            this.info.intervalInt = '立即转订单';
          }
          this.info.carts = null;
        }.bind(this)).catch(function(error){
          console.log('error');
      });
      this.getBillCartInfo(id);
    },
    getBillCartInfo(id){
      axios.get(URL+'list/listcarts/' + id,{
        params:{
          id:id
        }
      }).then(function(res){
        this.listcarts = res.data.data;
        let t = this.listcarts;
        let total = 0.00;
        if (this.listcarts != null){
          for(var i in this.listcarts){
            total += this.listcarts[i].totoalPrice.amount;
          }
        }
        this.listcarts_totalPrice = total;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    del(id){
      this.delModal = true;
      this.delId = id;
    },
    dodel(){
      let id = this.delId;
      axios.delete(URL+'list/delreclist/' + id,{
      }).then(function(res){
        if (res.data.errorCode==200){
          this.$Message.error('删除成功');
          this.delModal = false;
          this.dataInit();
        }
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
