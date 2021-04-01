export function debounce(func, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 正则表达式：字符串匹配 利器
export function formatDate(date, fmt) {
  // 1.获取年份
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  // 2.获取
  // M+ -> 正则表达式中的一个规则
  // ？ 表示0个或者1个
  // + 表示1个或者多个
  // * 表示0个或者多个
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};


export const parseTime = time => {
	const format = '{y}-{m}-{d} {h}:{i}:{s}'
	let date = null
	if(typeof time === 'string'){
		time = parseInt(time)
	}
	date = new Date(time)
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
	}
	const strTime = format.replace(/{(y|m|d|h|i|s)+}/g, (result, key) => {
		let value = formatObj[key]
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value
	})
	return strTime
}
