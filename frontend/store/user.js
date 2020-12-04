export const state = () => ({
    me: ''
})

export const mutations = {
    SET_ME(state, payload){
        state.me = payload
        console.log('stateMe', state.me)
    }
}

export const actions = {
    async loadUser({ state, commit }) {
    try {
        const res = await this.$axios.get('/user', {
        withCredentials: true,
        });
        commit('SET_ME', res.data);
    } catch (err) {
        console.error(err);
    }
    },

    signup({commit}, payload){
        this.$axios.post(`/user/signup`, {
            username: payload.username,
            email: payload.email,
            password: payload.password
        }, {withCredentials: true})
        .then((res)=>{
            commit('SET_ME', res.data)
        }).catch((err)=>{
            console.error(err.body)
        })
    },

    login({commit}, payload){
        this.$axios.post(`/user/login`, {
            email: payload.email,
            password: payload.password
        }, {withCredentials: true})
        .then((res)=>{
            console.log(res.data)
            commit('SET_ME', res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },


    logout({commit}){
        this.$axios.post(`/user/logout`, {}, {withCredentials: true})
        .then((res)=>{
            commit('SET_ME', null)
        }).catch((err)=>{
            console.log(err)
        })
    },




}


