<template>
  <div class="content-box">
    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>
    <Row class="margin-10">
      <Col span="10">
        <div class="searchBox addBox">
          <DatePicker type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" v-model="date" format="yyyy-MM-dd" @on-change="dateChange" @on-clear="dataClear"></DatePicker>
          <Input v-model="searchStr" icon="ios-search" placeholder="公司名称" style="width: 200px"></Input>
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
export default {
  data () {
    return {
      date:'',
      total:0,
      size:10,
      current:1,
      searchStr:'',
      startTs:'',
      status:'',
      endTs:'',
      spin:false,
      data1: [],
      csv:'',
      columns1: [
                 {
                     title: '商品名称',
                     key: 'name'
                 },
                 {
                     title: '单品数量',
                     key: 'quantity'
                 },
                 {
                     title: '单品规格',
                     key: 'productOption',
                     render:(h,params)=>{
                        var str = '';
                        for(var i = 0; i< params.row.productOption.length;i++){
                          str += params.row.productOption[i].attributeValue+' ';
                        }
                        return str;
                     }
                 },
                 {
                     title: '单品价格',
                     key: 'price',
                 },
                 {
                     title: '总金额',
                     key: 'total',
                 }, 
             ],
    }
  },
  mounted(){
    this.spin = true;
    axios.get(URL+'order/count',{
      params:{
        page:0,
        size:this.size,
      }
    }).then(function(res){
      var data = res.data.data;
      this.total = data.total;
      this.current = data.current+1;
      this.data1 = data.data.data;
      this.spin = false;
    }.bind(this)).catch(function(error){
      console.log(error);
    });

  },
  methods:{
    changePage(n){
      n = n-1;
      this.spin = true;
      axios.get(URL+'order/count',{
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
          this.data1 = data.data.data;
          this.spin = false;
      }.bind(this)).catch(function(error){
        console.log('error');
      });
    },
    search(){
      var dateStr = '';
      if(this.startTs!=''&& !isNaN(this.startTs)){
        dateStr = '&startTs='+this.startTs+'&endTs='+this.endTs;
      }
      var searchStr = '';
      if(this.searchStr!=''){
        searchStr = 'companyName='+this.searchStr;
      }
      axios.get(URL+'order/count',{
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
          this.data1 = data.data.data;
          this.$Message.success('查询成功');
        }.bind(this)).catch(function(res){
          this.$Message.error('查询请求失败');
        }.bind(this));
    },
    dateChange(e){
      this.startTs=Date.parse(new Date(e[0]));
      this.endTs=Date.parse(new Date(e[1]));
    },
    dataClear(){
      this.startTs = '';
      this.endTs = '';
    },
    exportData(){
      if(this.startTs==''){
        this.$Message.error('请选择导出时间');
        return;
      }
      var dateStr = '';
      if(this.startTs!=''&& !isNaN(this.startTs)){
        dateStr = '&startTs='+this.startTs+'&endTs='+this.endTs;
      }
      var searchStr = '';
      if(this.searchStr!=''){
        searchStr = 'companyName='+this.searchStr;
      }
      axios.get(URL+'order/count?'+searchStr+dateStr)
        .then(function(res){
          var data = res.data.data;
          this.csv = data.data.data;
          // 导出Excel文件
          this.$refs.table.exportCsv({
            filename: 'data',
            columns: this.columns1,
            data: this.csv.filter((data, index) => {
              var str = '';
              for(var i = 0; i< data.productOption.length;i++){
                str += data.productOption[i].attributeValue+' ';
              }
              data.productOption = str;
              return data;
            })
          });

        }.bind(this)).catch(function(res){
          this.$Message.error('查询请求失败');
        }.bind(this));

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
