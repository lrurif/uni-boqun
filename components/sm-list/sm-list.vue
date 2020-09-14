<template>
	<view>
		<scroll-view :style="{height:`${height}px`,position:'relative'}" scroll-y @scrolltoupper="scrollTop" @scrolltolower="scrollBottom"
		 @scroll="handleScroll">
			<view class="list" :style="{
					  'transform': `translateY(${offset}px)`
				  }">
				<sm-list-item :id="'itemId'+index" v-for="(item, index) in visibleData" :data="item" :index="index" :key="index">
					<slot :data="item" />
				</sm-list-item>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import smListItem from "../sm-list-item/sm-list-item.vue"

	export default {
		compoments: {
			smListItem
		},
		props: {
			// 保持的item数量
			remain: {
				type: Number,
				default: 10
			},
			// 数据
			data: {
				type: Array,
				default: []
			},
			// list高度
			height: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				start: 0,
				end: this.remain,
				offset: 0,
				itemHeight: 1
			};
		},
		created: function() {
			this.$nextTick(() => {
				setTimeout(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('#itemId0').boundingClientRect(data => {
						if (data && data.height) {
							this.itemHeight = data.height
						}
					}).exec();
				}, 80)
			})
		},
		computed: {
			preCount() {
				return Math.min(this.start, this.remain)
			},
			nextCount() {
				return Math.min(this.data.length - this.end, this.remain)
			},
			visibleData() {
				return this.data.slice(this.start - this.preCount, this.end + this.nextCount)
			},
			scrollHeight() {
				return this.remain * this.itemHeight
			},
			localHeight() {
				return this.data.length * this.itemHeight
			}
		},
		methods: {
			scrollTop: function() {
				this.$emit('top')
			},
			scrollBottom: function() {
				this.$emit('load')
			},
			handleScroll: function(event) {
				const scrollTop = event.detail.scrollTop;
				const start = Math.floor(scrollTop / this.itemHeight)
				this.start = start < 0 ? 0 : start;
				this.end = this.start + this.remain;
				const mOffset = scrollTop - (scrollTop % this.itemHeight) - this.preCount * this.itemHeight
				this.offset = mOffset < 0 ? 0 : mOffset;
			}
		}
	}
</script>

<style scoped>
	.list {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
</style>
