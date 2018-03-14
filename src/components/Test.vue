<template>
	<div>
		<button @click="printpage">print</button>
	</div>
</template>
<script>
    export default {
        data () {
            return {
                test:'wang'
            }
        },

        methods: {
            printpage(){
                // console.log(window.location.host+'/print.html');
                // window.open(window.location.host+'/print.html');
                window.open('http://localhost/print.html');
            }
        },
        mounted () {

        }
    }
</script>
<style scoped>

</style>