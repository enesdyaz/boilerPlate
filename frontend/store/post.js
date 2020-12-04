import throttle from 'lodash.throttle'

export const state = () => ({
    postItem: [],
    commentItem: [],
    imagePaths: [],

})


export const mutations = {
    CREATE_POST(state, res){
        state.postItem.unshift(res.data)
    },

    LOAD_POST(state, res){
        console.log('LOAD_POST', res.data)
        state.postItem = state.postItem.concat(res.data)
        console.log('STATE_POST', state.postItem)

    },



    REMOVE_POST(state, payload){
        const index = state.postItem.findIndex(v => v.id === payload.postId);
        state.postItem.splice(index, 1)
    },

    CREATE_COMMENT(state, payload){
        state.commentItem.unshift(payload.data)
        const index = state.postItem.findIndex(v => v.id === payload.data.PostId);
        state.postItem[index].Comments.unshift(payload.data)
    },

    LOAD_COMMENT(state, res){
        state.commentItem = res.data
    },
    REMOVE_COMMENT(state, payload){
        const index = state.commentItem.findIndex(v => v.id === payload.commentId);
        state.commentItem.splice(index, 1)
    },


    IMAGE_PATH(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload);
    },
    REMOVE_IMAGE_PATH(state, payload){
        state.imagePaths.splice(payload, 1);
    },
    REMOVE_ALL_IMAGE_PATH(state){
        state.imagePaths = []
    }

}






export const actions= {

    async loadPost({commit, state}, payload){
            try{
                console.log('action 진입')
                const lastPost = state.postItem[state.postItem.length -1] // 마지막 게시물
                console.log('last Post ', lastPost && lastPost.id)
                const res =  await this.$axios.get(`/post/loadPost?lastId=${lastPost && lastPost.id}&limit=5`, {withCredentials: true})
                commit('LOAD_POST', res)
                return res.data.length
            }catch(err){
            }        
    },  

    async createPost({commit, state}, payload){
        try{
            const res =  await this.$axios.post('/post/createPost', {
                postContent: payload.postContent,
                src: state.imagePaths
            }, {withCredentials: true})
            commit('CREATE_POST', res)
            commit('REMOVE_ALL_IMAGE_PATH')
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
            const res =  await this.$axios.post(`/post/${payload.postId}/createComment`, payload, {withCredentials: true})
            commit('CREATE_COMMENT', res)
        }catch(err){
            console.log(err)
        }
    },
    
    async loadComment({commit}, payload){
        try{
            const res = await this.$axios.get(`/post/${payload.postId}/loadComment`,  {withCredentials: true})
            commit('LOAD_COMMENT', res)
        }catch(err){
            console.log(err)
        }
    },

    async removeComment({commit}, payload){
        try{
            const res = await this.$axios.delete(`/post/${payload.commentId}/removeComment`,  {withCredentials: true})
            commit('REMOVE_COMMENT', payload)
        }catch(err){
            console.log(err)
        }
    },



    uploadImages({ commit }, payload) {
        this.$axios.post('/post/images', payload, {
        withCredentials: true,
        })
        .then((res) => {
            commit('IMAGE_PATH', res.data);
        })
        .catch((err) => {
            console.error(err);
        });
    },


}
