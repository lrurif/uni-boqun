<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			console.log(this.$u.config.v)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@font-face {
	  font-family: 'iconfont';  /* project id 2050202 */
	  src: url('//at.alicdn.com/t/font_2050202_td60586esk.eot');
	  src: url('//at.alicdn.com/t/font_2050202_td60586esk.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_2050202_td60586esk.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_2050202_td60586esk.woff') format('woff'),
	  url('//at.alicdn.com/t/font_2050202_td60586esk.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_2050202_td60586esk.svg#iconfont') format('svg');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.icon-message:before {
		content: "\e601";
	}
	.icon-like:before {
		content: "\e671";
	}
	.icon-collect-no:before {
		content: "\e647";
	}
	.icon-collect:before {
		content: "\e602";
	}
	.icon-zan:before {
		content: "\e603";
	}
	.icon-send-message::before {
		content: "\e628";
	}
	.icon-bottom-emoil::before {
		content: "\e791";
	}
	.icon-yes::before {
		content: "\e65a";
	}
	.icon-add::before {
		content: "\e610";
	}
	.icon-cancel::before {
		content: "\e609";
	}
	.icon-rubbish::before {
		content: "\e62b";
	}
	/* 清除浮动 */
	.clearfix:after {
	  content: "";
	  display: block;
	  height: 0;
	  clear:both;
	  visibility: hidden;
	}
	/*每个页面公共css */
</style>
