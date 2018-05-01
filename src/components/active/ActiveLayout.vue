<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="android-settings"></Icon>
	                        特价活动
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/active/index">优惠券</router-link></MenuItem>
	                    <MenuItem name="1-2"><router-link tag="div" to="/active/index/goodschange">商品兑换</router-link></MenuItem>
	                    <MenuItem name="1-3"><router-link tag="div" to="/active/index/specialgoods">特价商品</router-link></MenuItem>
	                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>