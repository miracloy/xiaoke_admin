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
                      <MenuItem name="1-2"><router-link tag="div" to="/checkbalance/index/index"> 应付</router-link></MenuItem>
                      <MenuItem name="1-3"><router-link tag="div" to="/checkbalance/index/index_receive"> 应收</router-link></MenuItem>
                  </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>
