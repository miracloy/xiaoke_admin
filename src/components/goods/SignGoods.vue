<template>
	<div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>
    
		<Row class="margin-10">
		  <Col span="2">
		    <div class="addBox">
		      <Button type="info" icon="plus" @click="addModal=true">添加</Button>
		    </div>
		  </Col>
		</Row>
		
		<div class="layout-content-main">
		 <Table stripe border highlight-row :columns="columns1" :data="data1" size="small"></Table>
		</div>

		<Modal
		    v-model="addModal"
		    title="添加标签商品"
		    @on-ok="add"
		    @on-cancel="addModal=false">
        <p> <Input v-model="searchStr" icon="ios-search" placeholder="名称/编号" @input="search"></Input></p>
		    <Table stripe highlight-row :columns="columns2" :data="data2"></Table>
		</Modal>

		<Modal
		    v-model="UpdateModal"
		    title="修改标签"
		    @on-ok="update"
		    @on-cancel="UpdateModal=false">
		    <p class="margin-10">名称 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="signData.name" placeholder="名称" style="width: 300px" ></Input></p>
		    <p class="margin-10">排序 &nbsp;&nbsp;&nbsp;&nbsp;<Input v-model="signData.sort" placeholder="排序" style="width: 300px" ></Input></p>
		</Modal>

	</div>
</template>
<script>
import axios from 'axios'
import {URL} from '@/api/config.js'
export default {
  data () {
    return {
      addModal:false,
      UpdateModal:false,
      signData:{
      	name:'',
      	sort:2
      },
      data1: [],
      data2: [],
      searchStr:'',
      columns1: [
                {
                    title: '编号',
                    key: 'number',
                },
                {
                    title: '图片',
                    key: 'img',
                    render:(h,params)=>{
                      return h('Avatar',{
                          props:{
                            src:params.row.img,
                            size:'large',
                            shape:'square'
                          }
                      },'')
                    }
                },
                {
                    title: '商品',
                    key: 'name',
                },
                {
                    title: '状态',
                    key: 'status',
                },
                {
                    title: '操作',
                    key: 'action',
                    render:(h,params)=>{
                      return h('Button',{
                          props:{
                            type:'error',
                            size:'small'
                          }
                      },'删除');
                    }
                }
            ],
      columns2: [
                {
                    title: '图片',
                    key: 'img',
                    render:(h,params)=>{
                      return h('Avatar',{
                          props:{
                            src:params.row.img,
                            size:'large',
                            shape:'square'
                          }
                      },'')
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                },
                {
                    title: '编号',
                    key: 'number',
                },
                {
                    title: '状态',
                    key: 'status',
                },
                {
                    title: '选择',
                    key: 'action',
                    render:(h,params)=>{
                      return h('div',{});
                    }
                }
            ],
    }
  },
  mounted(){
        this.data1 = [
          {sign_name:'饮料',name:'柚子茶',img:'https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=346621568,2515766694&fm=85&s=3A9C778649317C1F46F78E7C03004079',number:'1212121',status:1,}
        ];
  },
  methods:{
  	add(){
  		var data = {
  			sign_name:this.signData.name,
  			sort:this.signData.sort,
  		}
  		this.data1.push(data);
  		this.signData = {name:'',sort:2}; 
  	},
    search(){
      console.log(this.searchStr);
      this.data2 = [
          {sign_name:'饮料',name:'柚子茶',img:'https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=346621568,2515766694&fm=85&s=3A9C778649317C1F46F78E7C03004079',number:'1212121',status:1,},
          {sign_name:'饮料',name:'柚子茶',img:'https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=346621568,2515766694&fm=85&s=3A9C778649317C1F46F78E7C03004079',number:'1212121',status:1,},
        ];
    }
  }
}
</script>