<template>
<div>
    <div style='margin-left: -10px;'>
        <v-btn x-small text color='blue-grey' @click='onToggle()'>comment</v-btn>
    </div>

    <div v-if='toggle'>
        <v-textarea class='pt-2 body-2' color='blue-grey' rows='1' auto-grow label='comment' v-model='commentContent' hide-details outlined dense
        :append-outer-icon="commentContent ? 'mdi-comment-plus-outline' : 'mdi-comment-processing-outline'"
        @click:append-outer="onCommentSend">
        </v-textarea> 
        <div>
            <comment-view :post="postId"></comment-view>
        </div>
    </div>
 
</div>
</template>
<script>
import commentView from '../post/commentView'
export default {
    props:{
        postId:{
            type: Number,
            requried: true
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
            console.log('send Comment')
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