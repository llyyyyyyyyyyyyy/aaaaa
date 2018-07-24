import vuex from 'vuex'
import vue from 'vue'
vue.use(vuex);
const state = {
	//相册数据
	photo: [],
}

const getters = {
	photo: state => state.photo,
}

const mutations = {
	commit_photo(state, p){
		state.photo = p
	}
}

const actions = {
	fetch_photo({ commit }, p){
		commit('commit_photo', p)
	}
}
export default new vuex.Store({
	  state,
	  getters,
	  mutations,
	  actions
})
