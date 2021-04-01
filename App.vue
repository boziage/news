<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// uni.login({
				
			// })
			// 605c310f99548d000188b0e4
			this.$api.get_user({
				user_id: '60659a6959633b0001bf7930'
			}).then(res => {
				// console.log(res);
				const {data} = res
				this.$store.dispatch('set_userinfo', data)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import 'components/gaoyia-parse/parse.css';
</style>
