<template>
<div>
    <div style='margin-left: -10px;'>
        <v-btn x-small text color='blue-grey' @click='onToggle()'>comment ({{postComment.length}}) </v-btn>
    </div>
    <transition name='fade'>
    <div v-if='toggle'>
        <v-textarea class='pt-2 body-2' color='blue-grey' rows='1' auto-grow label='comment' v-model='commentContent' hide-details outlined dense
        :append-outer-icon="commentContent ? 'mdi-comment-plus-outline' : 'mdi-comment-processing-outline'"
        @click:append-outer="onCommentSend">
        </v-textarea> 
        <div>
            <comment-view :post="postId" ></comment-view>
        </div>
    </div>
    </transition>
 
</div>
</template>
<script>
import commentView from '../post/commentView'
export default {
    props:{
        postId:{
            type: Number,
            requried: true
        },
        postComment:{
            type: Array,
        }
    },
    components:{
        commentView
    },
    data(){
        return{
            commentContent:'',
            toggle: false,
        }
    },


    methods:{
        onCommentSend(){
            this.$store.dispatch('post/createComment', {
                commentContent: this.commentContent,
                postId: this.postId
            }).then(()=>{
                this.commentContent = ''
            })
        },
        onToggle(){
            this.toggle = !this.toggle
        }

    }
}
</script>
<style lang="scss">  //전역 설정
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>