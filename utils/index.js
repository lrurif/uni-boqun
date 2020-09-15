
let baseUrl = "http://101.201.152.125:3000/"
export function request({url,method, data= {}}) {
	return new Promise((resolve, reject)=> {
		uni.request({
			url: baseUrl + url,
			method,
			data,
			success(res) {
				resolve(res);
			},
			fail(e) {
				reject("未知错误");
				console.log(url)
				console.log(data)
			}
		})
	})
}
export function isLogin() {
	if(!uni.getStorageSync("userId")) {
		uni.switchTab({
			url: "/pages/my/my",
			success() {
				console.log("123")
			},
			fail() {
				console.log("456")
			}
		})
		return false;
	}
	return true;
}
export const getTime = (time)=> {
    var currentTime = new Date();
    var articleTime = new Date(time);
    if(currentTime - articleTime < 60*1000) {
        return "刚刚";
    }else if(currentTime-articleTime<60*60*1000) {
        return Math.ceil((currentTime - articleTime)/(1000*60))+"分钟前";
    }else if(currentTime-articleTime<24*60*60*1000) {
    	return Math.ceil((currentTime - articleTime)/(1000*60*60))+"个小时前";
    }else if(currentTime-articleTime<3*24*60*60*1000) {
    	return Math.floor((currentTime - articleTime)/(1000*60*60*24))+"天前";
    }else if(currentTime-articleTime<365*24*60*60*1000) {
    	return `${articleTime.getMonth()+1}月${articleTime.getDate()}日`;
    }else {
    	return `${articleTime.getFullYear()}年${articleTime.getMonth()+1}月${articleTime.getDate()}日`;
    }
}
// 防抖函数
export const debounce = (func, time) => {
    var timer = null;
    return function() {
        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(()=> {
            func.call(this);
        }, time);
    }
    
}
export function throttle(func, wait, start, end) {
	let timer = null, prev = 0;
	function throttled() {
		let context = this, args = arguments;
		if(!prev && start === false) prev = new Date().getTime();
		let remain = wait - (new Date().getTime() - prev);
		if(remain <= 0) {
			if(timer) {
				clearTimeout(timer);
				timer = null;
			}
			func.apply(context, args);
			prev = new Date().getTime();
		}else if(end && !timer) {
			timer = setTimeout(function() {
				func.apply(context, args);
				timer = null;
				prev = start?new Date().getTime():0;
			},remain)
		}

	}
	throttled.cancel= function() {
		clearTimeout(timer);
		timer = null;
		prev = start?new Date().getTime():0;
	}
	return throttled;
}