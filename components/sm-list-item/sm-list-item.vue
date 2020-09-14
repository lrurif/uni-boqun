<template>
	<view>
		<slot v-bind:data="data" v-bind:index="index"></slot>
	</view>
</template>

<script>
	// 方便扩展
	export default {
		props: {
			index: {
				type: Number,
				default: 0
			},
			data: {}
		}
	}
</script>

<style>
</style>
