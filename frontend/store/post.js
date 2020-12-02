

export const state = () => ({
    postItem: [],
    commentItem: [],
})

export const mutations = {
//POST-MUTATION
    CREATE_POST(state, res){
        console.log('POST_MUTATION', res)
        state.postItem.unshift({
            UserId: res.data.UserId,
            id: res.data.id,
            postContent: res.data.postContent,
            createdAt: res.data.createdAt,
            updatedAt:res.data.updatedAt,
            comment: []
        })
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

//COMMENT-MUTATION
    CREATE_COMMENT(state, res){
        state.commentItem.unshift(res.data)
    },

    LOAD_COMMENT(state, res){
        console.log('LOAD_COMMENT', res)
        state.commentItem = res.data
    }
}

export const actions= {

    async loadPost({commit}, payload){
        try{
            const res =  await this.$axios.get('/post/loadPost', {withCredentials: true})
            console.log('loadpost', res.data)
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
    }

}
