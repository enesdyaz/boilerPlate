

export const state = () => ({
    postItem: [],
    commentItem: [],
})

export const mutations = {
//POST-MUTATION
    CREATE_POST(state, res){
        console.log('POST_MUTATION', res.data)
        state.postItem.unshift(res.data)
    },
    LOAD_POST(state, res){
        console.log('LOAD_POST', res.data)
        state.postItem = res.data
        console.log('STATE_POST', state.postItem)

    },
    REMOVE_POST(state, payload){
        console.log('index', payload)
        const index = state.postItem.findIndex(v => v.id === payload.postId);
        state.postItem.splice(index, 1)
    },

    CREATE_COMMENT(state, payload){
        state.commentItem.unshift(payload.data)

        console.log('CREATE_COMMENT',payload)
        const index = state.postItem.findIndex(v => v.id === payload.data.PostId);
        console.log('index=', index)

        state.postItem[index].Comments.unshift(payload.data)
    },

    LOAD_COMMENT(state, res){
        console.log('LOAD_COMMENT', res)
        state.commentItem = res.data
    },
    REMOVE_COMMENT(state, payload){
        console.log(payload.commentId)
        const index = state.commentItem.findIndex(v => v.id === payload.commentId);
        console.log('index_number', index)

        state.commentItem.splice(index, 1)
    },

}

export const actions= {

    async loadPost({commit}, payload){
        try{
            const res =  await this.$axios.get('/post/loadPost', {withCredentials: true})
            console.log('load_post', res.data)
            commit('LOAD_POST', res)
        }catch(err){
            console.log(err)
        }
    },

    async createPost({commit}, payload){
        try{
            const res =  await this.$axios.post('/post/createPost', payload, {withCredentials: true})
            console.log(res.data)
            commit('CREATE_POST', res)
        }catch(err){
            console.log(err)
        }
    },

    async removePost({commit}, payload){
        try{
            const res =  await this.$axios.delete(`/post/delete/${payload.postId}`, {withCredentials: true})
            commit('REMOVE_POST', payload)
        }catch(err){
            console.log(err)
        }
    },


//COMMENT
    async createComment({commit}, payload){
        try{
            console.log('createComment', payload)
            const res =  await this.$axios.post(`/post/${payload.postId}/createComment`, payload, {withCredentials: true})
            commit('CREATE_COMMENT', res)
        }catch(err){
            console.log(err)
        }
    },
    
    async loadComment({commit}, payload){
        try{
            console.log('loadComment', payload)
            const res = await this.$axios.get(`/post/${payload.postId}/loadComment`,  {withCredentials: true})
            commit('LOAD_COMMENT', res)
        }catch(err){
            console.log(err)
        }
    },

    async removeComment({commit}, payload){
        try{
            console.log('removeComment', payload.commentId)
            const res = await this.$axios.delete(`/post/${payload.commentId}/removeComment`,  {withCredentials: true})
            commit('REMOVE_COMMENT', payload)
        }catch(err){
            console.log(err)
        }
    },

}
