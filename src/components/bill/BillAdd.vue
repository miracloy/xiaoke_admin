<template>
  <div class="content-box">

    <Row>
      <Col span="6">
            <Bread></Bread>
      </Col>
    </Row>

      <Row>
        <Col span="24">
          <h3>新增清单</h3>
        </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单名称</p>
          </Col>
          <Col span="10">
            <Input v-model="formItem.name" style="width: 300px"></Input>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单类型</p>
          </Col>
          <Col span="10">
            <Select v-model="formItem.billcate" style="width:200px">
                <Option v-for="item in billcates" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
      </Row>
  
      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">用户</p>
          </Col>
          <Col span="10">
            <Input v-model="formItem.name" style="width: 300px"></Input>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">套餐类型</p>
          </Col>
          <Col span="10">
            <RadioGroup v-model="formItem.type">
                <Radio label="单人份"></Radio>
                <Radio label="分享装"></Radio>
            </RadioGroup>
          </Col>
      </Row>

      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">人均消费标准</p>
          </Col>
          <Col span="10">
            人数 <InputNumber :max="100" :min="1" v-model="formItem.personNumber"></InputNumber>
            人均消费 <InputNumber :max="1000" :min="0" v-model="formItem.personMoney"></InputNumber>
            总金额 <InputNumber :max="10000" :min="0" v-model="formItem.personSum"></InputNumber>
          </Col>
      </Row>
      
      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">清单所含商品</p>
          </Col>
          <Col span="10">
              <table class="table">
                <tr>
                  <td><img src="https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=346621568,2515766694&fm=85&s=3A9C778649317C1F46F78E7C03004079"></td>
                  <td>柚子茶</td>
                  <td><input type="text" placeholder="400ml"></td>
                  <td><Icon type="minus-circled"></Icon><input type="number" width="50"><Icon type="plus-circled"></Icon></td>
                  <td>￥90</td>
                </tr>
                <tr>
                  <td colspan="5" style="text-align:center;">
                    <Button type="info" size="small" icon="plus-circled" @click="addModal=true">添加单个商品</Button>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="text-align:center;">
                    <Button type="primary" size="small" icon="plus-circled">添加常用商品组</Button>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" style="text-align:right;">
                      <span style="display:inline-block;padding:5px;border:1px solid #ccc;">总计：￥150</span>
                  </td>
                </tr>
              </table>
          </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">顾客需求</p>
        </Col>
        <Col span="10">
          <Input type="textarea" v-model="formItem.name" style="width: 300px"></Input>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">配送时间</p>
        </Col>
        <Col span="10">
          <Input v-model="formItem.name" style="width: 300px"></Input>
        </Col>
      </Row>

      <Row class="margin-10">
        <Col span="4">
          <p class="input-text">配送地址</p>
        </Col>
        <Col span="10">
          <Input v-model="formItem.name" style="width: 300px"></Input>
        </Col>
      </Row>



      <Row class="margin-10">
          <Col span="4">
            <p class="input-text">是否自动转成订单</p>
          </Col>
          <Col span="10">
            <RadioGroup v-model="formItem.auto">
                <p class='margin-10'><Radio label="1"> 是</Radio> <InputNumber :max="30" :min="1" style="width:50px;"></InputNumber> 小时后自动转成订单</p>
                <p class='margin-10'><Radio label="2"> 否</Radio></p>
                <p class='margin-10'><Radio label="3"> 立即转成订单</Radio></p>
            </RadioGroup>
          </Col>
      </Row>

      <Row class="margin-10">
        <Col span="10" class="save">
          <Button type="primary" size="large" >保存</Button>
        </Col>
      </Row>

      <Modal
          v-model="addModal"
          title="添加单个商品"
          @on-ok="add"
          @on-cancel="addModal=false">
      
          <Row>
            <Col span="24">
                <Input placeholder="搜索商品" style="width: 200px"></Input><Button type="info" icon="ios-search" @click="search">搜索</Button>
            </Col>
          </Row>
          <Row>
            <Col span="4">
              <RadioGroup v-model="searchCate" type="button" vertical>  
                  <Radio label="饮料"></Radio>
                  <Radio label="小吃"></Radio>
                  <Radio label="水果"></Radio>
                  <Radio label="其他"></Radio>
              </RadioGroup>
            </Col>
            <Col span="20">
                <table class="table">
                  <tr>
                    <td><img src="https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=346621568,2515766694&fm=85&s=3A9C778649317C1F46F78E7C03004079"></td>
                    <td>柚子茶</td>
                    <td><input type="text" placeholder="400ml"></td>
                    <td>￥90</td>
                    <td><Icon type="minus-circled"></Icon><input type="number" width="50"><Icon type="plus-circled"></Icon></td>
                    <td><Button type="warning" size="small">删除</Button></td>
                  </tr>
                </table>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <p class="margin-10">总数：2 总计: 40</p>
            </Col>
          </Row>
          
      </Modal>



  </div>
</template>
<script type="text/javascript">

export default{
  data(){
    return {
      formItem:{
        name:'',
        content:'',
        billcate:'',
        type:'单人份',
        personNumber:1,
        personMoney:0,
        personSum:0,
        auto:1
      },

      billcates:[
        {value:'0',label:'普通'},
        {value:'1',label:'特别'},
      ],

      addModal:false,
      searchCate:'饮料',
    }
  },
  methods:{
    add(){

    },
    search(){

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
  width: 100%;
  border-collapse: collapse;
}
.table tr{
    border:1px solid #ccc;
}
.table td{
  padding:5px;
  
}
.table td img{
  width: 50px;
}
.table td input{
  width: 50px;
}
</style>