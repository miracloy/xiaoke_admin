<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="ios-list"></Icon>
	                        对账管理
	                    </template>
	                    <!-- <MenuItem name="1-1"><router-link tag="div" to="/checkbalance/index/index">进货单</router-link></MenuItem> -->
                      <MenuItem name="1-2"><router-link tag="div" to="/checkbalance/index/supplyCompany">供应商</router-link></MenuItem>
                      <MenuItem name="1-3"><router-link tag="div" to="/checkbalance/index/wareHouseProduct">库存商品</router-link></MenuItem>
                      <Submenu name="1-4">
                        <template slot="title">进货单</template>
                        <MenuItem name="1-4-1"><router-link tag="div" to="/checkbalance/index/index"> 正式</router-link></MenuItem>
                        <MenuItem name="1-4-2"><router-link tag="div" to="/checkbalance/index/inputDraft"> 草稿</router-link></MenuItem>
                      </Submenu>
                  </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>
