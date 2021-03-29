# 初始化数据库
详情看uniCloud
# 配置 tabbar
详情看pages.json
# 自定义字体图标
[插件市场](https://ext.dcloud.net.cn/)
# 自定义导航栏navbar
"navigationStyle":"custom"
封装为navbar组件
# 导航分类tab(index页面下)
请求云函数获取数据
封装tab组件,利用scroll-view实现滚动
v-for遍历
active组合拳实现激活后颜色改变
# index布局及list制作
index flex垂直布局,确保显示正确
封装list内容,利用scroll-view实现组件滚动?,此时滚动用不了(没有高度)
设置高度,list可滚动
# 封装数据请求
$http > list(导出各种请求，在这里维护,将promise方法封装到$http中共用) > 
index(list的集合（中转站）,并批量导出（利用require.context + Object.assign）) > 
Vue.prototype.$api(注册全局变量,便于随时请求,不用import)
# 卡片制作
布局的事
后面创建云函数get_list将数据实时渲染到卡片上
# 内容切换
list套swiper(利用轮播图的特性)
与tab数据间的传递,实现效果联动(切换同时分类切换,且请求分类数据并渲染上去)
index为中介,负责请求数据,并在tab和list之间搭起桥梁传递数据

分类数据请求:
1.父传子传入tab后将tab v-for展示相应的卡片数量与数据
2.触发change()事件的时候将当前的name传递到getList,云函数中,将获取到的event值传递到云函数
3.此时普通查询已经不足以满足需求,使用聚合(能在普通的基础上加上筛选),使得change事件触发的时候,数据通过event(name)筛选数据

this.list = data使得切换的时候有闪一下,观感不好,用对象直接缓存数据而不是以前用数组缓存每次修改,并顺带改造为懒加载,并加上loading组件
# 收藏
封装不说了,云函数update_like的实现,用来联动点击效果将数据上传到服务器,但刷新后复原了(因为get_list没有相关收藏的数据)
在get_list表里面加入一个is_like保存状态,因为现在get_list要传多一个user_id,不想外面每次写都传于是写在http.js里(将data解构并加入user_id重新封装)
# 搜索页面
pages:home-search
利用v-if/v-show设置navbar点击时候,index与home-search的切换
利用v-if/v-show设置home-search页面input时候历史记录和内容的切换

新封装了一个云函数get_search,类get_list,但去除分页内容,并加入正则表达式用于匹配内容显示,将数据关联searchList展示搜索结果,简单防抖减少搜索频率
历史记录的保存,通过vuex保存历史记录,并在actions和mutations处理state的逻辑,并将数据关联historyLists展示搜索历史,
uni.getStorageSync("_history")用本地缓存持久化state数据,避免刷新页面数据初始
# 标签页
布局不说了
改造云函数get_label,添加一个userinfo.label_ids数组保存我的标签id,并在该数组里面加入current属性
(在label_ids里面的数据current都为true,true用于标识用户"我的标签")
新的云函数update_label,用来更新label_ids里面的数据

将数据关联到labelList和list,get_label返回后利用filter将标签分成两部分,并展示

标签点击完成后,发送自定义事件与index联动,使得同步,在onLoad监听到以后请求getlabel(建议将数据初始化,避免发生数据重复?)
这里会重新渲染tablist数据,然后在list里面watch监听到,清空缓存数据后,重新请求getlist列表数据

get_label:请求标签数据
get_list:请求列表数据
get_search:请求搜索内容,类get_label,去除分页,加入正则匹配内容
update_label:更新标签状态,联动首页标签与自定义标签分组
update_like:相关收藏数据,持久化保存在相关用户的数据里
# 详情页
布局不说了
内容预加载:list-card将item解构合适的在params,并在跳转的时候用query的方式传参,在home-detail展示
(内容预加载算是程序的优化,能避免白屏太久,能把能用的数据先加载)

详情数据的加载:新建get_detail云函数,用户传递user_id与article_id
返回收藏,点赞,关注作者,文章详情这些数据