<template>
	<div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

		<Row>
	      <Col span="24">
	        <h3>添加商品</h3>
	      </Col>
	    </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">类别</p>
        </Col>
        <Col span="16">
          <Select v-model="formItem.categoryId" style="width:200px">
              <Option v-for="item in categorys" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
      </Row>

    	<Row class="margin-10">
          <Col span="4">
            <p class="input-text">商品名称</p>
          </Col>
          <Col span="10">
            <Input v-model="formItem.name" style="width: 300px"></Input>
          </Col>
        </Row>

      <Row class="margin-10">
        <Col span="4">
        <p class="input-text">供应商</p>
        </Col>
        <Col span="10">
        <p>
          <Select filterable clearable v-model="formItem.companyId" placeholder="供应商选择" style="width:240px;" >
            <Option v-for="item in companyList" :value="item.value" :key="item.label">{{item.label}}</Option>
          </Select>
        </p>
        </Col>
      </Row>

    	<Row class="margin-10">
          <Col span="4">
            <p class="input-text">商品图片</p>
          </Col>
          <Col span="10">
            <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <Upload
                ref="upload"
                :data="headers"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//up.qbox.me"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
            </Modal>
          </Col>
        </Row>

    	<Row class="margin-10">
          <Col span="4">
            <p class="input-text">库存</p>
          </Col>
          <Col span="10">
            <InputNumber :max="100000" :min="0" v-model="formItem.qtyAvailable" style="width: 200px"></InputNumber>
          </Col>
        </Row>

    	<Row class="margin-10">
          <Col span="4">
            <p class="input-text">售价</p>
          </Col>
          <Col span="10">
            <InputNumber :max="100000" :min="0" v-model="formItem.price" style="width: 200px"></InputNumber>元
          </Col>
      </Row>

          <Row class="margin-10">
            <Col span="4">
            <p class="input-text">进货价</p>
            </Col>
            <Col span="10">
            <InputNumber :max="100000" :min="0" v-model="formItem.cost" style="width: 200px"></InputNumber>元
            </Col>
          </Row>

              <Row class="margin-10">
                <Col span="4">
                <p class="input-text">下单要求</p>
                </Col>
                <Col span="10">
                <Input v-model="formItem.orderRule" style="width: 300px"></Input>
                </Col>
              </Row>

              <Row class="margin-10">
                <Col span="4">
                <p class="input-text">供应需求</p>
                </Col>
                <Col span="10">
                <Input v-model="formItem.supplyRule" style="width: 300px"></Input>
                </Col>
              </Row>

              <Row class="margin-10">
                <Col span="4">
                <p class="input-text">发票类型</p>
                </Col>
                <Col span="10">
                  <Select v-model="formItem.invoice" style="width:100px" placeholder="选择发票">
                    <Option v-for="item in invoiceList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
                  </Select>
                </Col>
              </Row>
                <Row class="margin-10">
                  <Col span="4">
                    <p class="input-text">简介</p>
                  </Col>
                  <Col span="10">
                    <Input v-model="formItem.description" style="width: 300px"></Input>
                  </Col>
              </Row>
            <Row class="margin-10">
              <Col span="4">
              <p class="input-text">排序</p>
              </Col>
              <Col span="10">
              <InputNumber :max="100000" :min="0" :precision="0" v-model="formItem.orderNumber" style="width: 80px"></InputNumber>
              </Col>
            </Row>

                <Row class="margin-10">
                  <Col span="4">
                    <p class="input-text">详情</p>
                  </Col>
                  <Col span="16">
                    <div id="editorElem" style="text-align:left"></div>
                  </Col>
              </Row>

                <Row class="margin-10">
                  <Col span="10" class="save">
                    <Button type="primary" size="large" @click="save">保存</Button>
                  </Col>
              </Row>

              <Spin class="demo-spin-col" v-if="spin">
                  <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
                  <div>Loading</div>
              </Spin>
    <Modal
      v-model="chooseCompanyModal"
      title="选择供应商"
      @on-cancel="chooseCompanyModal=false" class="info">

      <Row>
        <Col span="5">
        <p class="input-text">公司名称：</p>
        </Col>
        <Col span="11">
        <p class="input-text" style="text-align: left;padding-bottom: 10px"><Input v-model="company_key"  style="width: 200px"></Input></p>
        </Col>
        <Col  span="3">
        <Button type="primary" @click="searchcompany">查询</Button>
        </Col>
      </Row>

      <Row>
        <Col>
        <Table stripe border highlight-row :columns="choose_company" :data="data1" size="small" ref="table"></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="company_total" :current="company_current" @on-change="company_changePage" :page-size="company_size"></Page>
          </div>
        </div>
        </Col>
      </Row>

    </Modal>
	</div>
</template>
<script type="text/javascript">

import axios from 'axios'
import {URL} from '@/api/config.js'
import E from 'wangeditor'
export default{
	data(){
		return {
			formItem:{
				name:'',
        imgs:[],
        price:0,
        cost: 0,
        orderRule: '',
        company: '',
        companyId: '',
        supplyRule: '',
        invoice: '',
        orderNumber: 0,
        description:'',
        categoryId:'',
        qtyAvailable:0,
        longDescription:''
			},
      companyList: [],
      chooseCompanyModal: false,
      choose_company:[
        {
          title: '操作',
          key: 'c',
          render:(h,params)=>{
            return h('Button',{
              props:{
                type:'info',
                size:'small'
              },
              on:{
                click:()=>{
                  this.setcompanytoInput(params.row);
                }
              }
            },'选择');
          }
        },
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '商家名称',
          key: 'companyName'
        },
        {
          title: '联系人',
          key: 'managerName'
        },
        {
          title: '联系方式',
          key: 'phoneNumber'
        },
        {
          title: '税号',
          key: 'taxNumber'
        },
        {
          title: '发票抬头',
          key: 'title'
        }

      ],
      company_total:0,
      company_size:5,
      company_current:1,
      company_key: '',
      data1: [],
      invoiceList: [
        {
          label: '普票',
          value: '普票'
        },
        {
          label: '专票',
          value: '专票'
        }

      ],
      token:'',
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      categorys:[],
      spin:false,
		}
	},
  computed:{
    headers(){
      return {
        'token':this.token
      }
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


    this.uploadList = this.$refs.upload.fileList;

    axios.get(URL+'token').then(function(res){
      this.token = res.data.data;
      console.log(this.token);
      this.qiniu();
    }.bind(this)).catch(function(error){
      console.log(error);
    });

    this._getCategory();
    this.getCompanyList();
  },
	methods:{
    _getCategory(){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        this.categorys = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    getCompanyList(){
      axios.get(URL+'company/getSimpleCompanies',{
        params:{
          type: 'SUPPLY'
        }
      }).then(function(res){
        var datas = res.data.data;
        var list = new Array();
        datas.forEach(function(v,i,datas){
          var o = {
            label: v.companyName + ' ' + v.managerName,
            value: v.id
          };
          list.push(o);
        });
        this.companyList = list;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 初始化七牛上传的方法
    qiniu(){
      var editor = new E('#editorElem')
      editor.customConfig.onchange = (html) => {
        this.formItem.longDescription = html;
      }
      editor.customConfig.uploadImgServer = '//up.qbox.me';
      editor.customConfig.uploadFileName = 'file';

      // 属性值会自动进行 encode ，此处无需 encode
      editor.customConfig.uploadImgParams = {
          token: this.token,
      }

      editor.customConfig.uploadImgHooks = {
          // 如果服务器端返回的不是 {errno:0, checkbalance: [...]} 这种格式，可使用该配置
          // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          customInsert: function (insertImg, result, editor) {
              // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
              // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

              // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
              var url = 'http://oyh65u6th.bkt.clouddn.com/'+result.key
              insertImg(url)

              // result 必须是一个 JSON 格式字符串！！！否则报错
              //
          }
      }

      editor.create();
    },
    // 上传图片相关
    handleView (name) {
        this.imgName = name;
        this.visible = true;
    },
    handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
        file.url = 'http://oyh65u6th.bkt.clouddn.com/'+res.key;
        this.formItem.imgs.push(res.key);
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: 'The file format is incorrect',
            desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: 'Exceeding file size limit',
            desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
    },
    handleBeforeUpload () {
        const check = this.uploadList.length < 5;
        if (!check) {
            this.$Notice.warning({
                title: 'Up to five pictures can be uploaded.'
            });
        }
        return check;
    },

    save(){
      var params = new URLSearchParams();
      params.append('name', this.formItem.name);
      params.append('imgs', this.formItem.imgs);
      params.append('price', this.formItem.price);
      params.append('description', this.formItem.description);
      params.append('categoryId', this.formItem.categoryId);
      params.append('qtyAvailable', this.formItem.qtyAvailable);
      params.append('longDescription', this.formItem.longDescription);

      params.append('cost', this.formItem.cost);
      params.append('orderRule', this.formItem.orderRule);
      params.append('supplyRule', this.formItem.supplyRule);
      params.append('invoice', this.formItem.invoice);
      params.append('orderNumber', this.formItem.orderNumber);
      params.append('companyId', this.formItem.companyId);
      axios.post(URL+'product',params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
          this.$Message.success('添加成功');
          this.$router.push('/goods/index/index');
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    // 选择供应商
    chooseCompany(){
      this.chooseCompanyModal = true;
    },

    // 选择供应商
    setcompanytoInput(obj){
      this.formItem.company =  obj.companyName;
      this.formItem.companyId =  obj.id;
      this.chooseCompanyModal = false;
    }


	},
}
</script>
<style scoped>
h3{
	background-color: #999;
	color: #fff;
	height: 40px;
	line-height: 40px;
	width: 100%;
	text-indent: 20px;
	margin-bottom: 20px;
}
.input-text{
	text-align: center;
	line-height: 32px;
}
.save{
	text-align: center;
}

.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
