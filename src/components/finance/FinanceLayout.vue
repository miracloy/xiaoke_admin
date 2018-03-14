<template>
	<div class="layout-content">
	    <Row>
	        <Col span="3">
	            <Menu active-name="1-1" width="auto" :open-names="['1']">
	                <Submenu name="1">
	                    <template slot="title">
	                        <Icon type="social-yen"></Icon>
	                        财务
	                    </template>
	                    <MenuItem name="1-1"><router-link tag="div" to="/finance/index">资金明细</router-link></MenuItem>
	                    <MenuItem name="1-2"><router-link tag="div" to="/finance/index/company">未结账期明细</router-link></MenuItem>
	                </Submenu>
	            </Menu>
	        </Col>
	        <Col span="21">
	           <router-view></router-view>
	        </Col>
	    </Row>
	</div>
</template>