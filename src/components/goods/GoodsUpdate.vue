<template>
	<div class="content-box">

      <Row>
        <Col span="6">
              <Bread></Bread>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="6" offset="1">
          <Button type="primary" @click="goUpdateBase" size="large">基础信息</Button>
          <Button type="default" @click="goUpdateSpec" size="large">规格</Button>
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
            <p class="input-text">商品图片</p>
          </Col>
          <Col span="10">
            <div class="demo-upload-list" v-for="item in uploadList" style="float:left;">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url" style="height:50px;margin-right:10px;">
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
            <InputNumber :max="100000" :min="0" v-model="formItem.quantityAvailable" style="width: 200px"></InputNumber>
          </Col>
        </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">价格</p>
          </Col>
          <Col span="10">
            <Input v-model="formItem.minPrice" style="width: 300px"></Input>
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
          <p class="input-text">详情</p>
        </Col>
        <Col span="16">
          <div id="editorElem" style="text-align:left"></div>
        </Col>
      </Row>

      <Row class="margin-10">
          <Col span="10" class="save">
            <Button type="primary" size="large" @click="updateSave">保存</Button>
          </Col>
      </Row>

      <Spin class="demo-spin-col" v-if="spin">
          <Icon type="load-c" size=25 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
      </Spin>

	</div>
</template>
<script type="text/javascript">


import axios from 'axios'
import {URL} from '@/api/config.js'
import E from 'wangeditor'
export default{
	data(){
		return {
      formItem:{},
			sku:{
        name:'',
        price:0,
        qtyAvailable:0,
        optionValue:[],
      },
      addModal:false,
      skuModal:false,
      specs:[],
      token:'',
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: [],
      token:'',
      categorys:[],
      spin:false,
      specValues:[],
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
    var id = this.$route.params.id;
    this.uploadList = this.$refs.upload.fileList;
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

    axios.get(URL+'product/'+id).then(function(res){
      var data = res.data;
      this.formItem = data.data;
      this.formItem.imgs.forEach(function(v,i){
        this.uploadList.push({
          url:v,
          status:'finished'
        });
      }.bind(this));


      this._getToken();

    }.bind(this)).catch(function(error){
      console.log(error);
    });

    this._getCategory();

    axios.get(URL+'product/option/'+id).then(function(res){
      var data = res.data;
      this.specValues = data.data.productOptions;
    }.bind(this)).catch(function(error){
      console.log(error);
    });

  },
	methods:{
    add(i){
      var id = this.specs[i].id;

      var params = new URLSearchParams();
      params.append('opId', id);
      axios.post(URL+'product/option/'+this.formItem.id,params).then(function(res){
        this.$Message.success('添加成功');
        this.$router.push('/goods/index/update/'+this.$router.params.id);
      }.bind(this)).catch(function(error){
        this.$Message.error('添加失败');
      }.bind(this));

    },
    addSpec(){
      this.addModal = true;
      axios.get(URL+'productoption').then(function(res){
        var data = res.data;
        this.specs = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });

    },
    _getToken(){
      axios.get(URL+'token').then(function(res){
        this.token = res.data.data;
        this.qiniu();
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    _getCategory(){
      axios.get(URL+'category').then(function(res){
        var data = res.data;
        this.categorys = data.data;
      }.bind(this)).catch(function(error){
        console.log(error);
      });
    },
    // 初始化七牛上传的方法
    qiniu(){
      var editor = new E('#editorElem');
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
      editor.txt.html(this.formItem.longDescription);
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
      console.log(res.key);
      console.log(file);
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

    updateSave(){
      var id = this.$route.params.id;
      console.log(this.uploadList);
      var imgs = [];
      this.uploadList.forEach(function(v,i){
        imgs.push(v.url);
      });

      var params = new URLSearchParams();
      params.append('name', this.formItem.name);
      params.append('imgs', imgs);
      params.append('price', this.formItem.minPrice);
      params.append('description', this.formItem.description);
      params.append('categoryId', this.formItem.categoryId);
      params.append('qtyAvailable', this.formItem.quantityAvailable);
      params.append('longDescription', this.formItem.longDescription);
      axios.post(URL+'product/'+id,params).then(function(res){
        if(res.data.errorCode!=200){
          this.$Message.error(res.data.moreInfo);
        }else{
         this.$Message.success('保存成功');
         this.$router.go(-1);
        }

      }.bind(this)).catch(function(error){
        this.$Message.error('保存失败');
      }.bind(this));
    },

    goUpdateSpec(){
      this.$router.push('/goods/index/updateSpec/'+this.$route.params.id);
    },
    goUpdateBase(){
      this.$router.push('/goods/index/update/'+this.$route.params.id);
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

.table{
  margin-top: 10px;
  width: 100%;
  border-collapse: collapse;
}
.table tr{
  border:1px solid #ccc;
}
.table td{
  padding: 5px;
}
</style>
