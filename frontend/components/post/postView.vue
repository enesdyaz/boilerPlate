<template>
<div>
    <!-- DISPLAY -->
<v-container>
<!-- carousel image -->
    <div class='wrap' v-for="post in postItems" :key='post.id'> 
        <transition name="fade">
            <div v-if="post.Images.length">
            <v-carousel :continuous="false"  :show-arrows="true" height="300" delimiter-icon="mdi-circle-medium">
                    <v-carousel-item v-for="p in post.Images" :key='p.id' touch :src="`http://localhost:3085/${p.src}`">
                    </v-carousel-item>
            </v-carousel>
            </div>
          </transition>

            
        <v-list expand three-line>
            <v-list-item>
                <v-list-item-content>
<!-- TEXT.... more ...more -->                
                    <div style='margin-top: 5px;'>
                            <text-more :postContent="post.postContent"></text-more>
                            <br>
<!-- time and navi -->                            
                            <div style='color: rgba(0,0,0,0.4);font-size: 0.8rem; display: inline-block'>{{timeForToday(post.createdAt)}}</div>
                            <div style='float: right;'>
                                <v-menu style='display: inline-block;' :close-on-content-click="true" dense :nudge-width="60"  offset-y >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" class='ml-4' style='font-size: 1.2rem;'>mdi-dots-horizontal</v-icon>
                                    </template>

                                    <div class='text-left pr-4' style='background: whitesmoke;'>
                                        <v-btn x-small @click='onRemovePost(post.id)' text><v-icon style='font-size: 1rem;padding-right: 4px;'>mdi-trash-can-outline</v-icon> REMOVE</v-btn><br>
                                        <v-btn x-small @click='onEditPost(post.id)' text><v-icon style='font-size: 1rem;padding-right: 4px;'>mdi-pencil-outline</v-icon> EDIT</v-btn>
                                    </div>
                                </v-menu>
                                <v-icon @click="onClickIcon" class='ml-4' style='font-size: 1.2rem;'>mdi-heart-outline</v-icon>
                                <v-icon class='ml-4' style='font-size: 1.4rem;'>mdi-twitter-retweet</v-icon>
                        </div>
                    </div>
                    <div>
                        <comment-form :postId="post.id" :postComment="post.Comments"></comment-form>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </div>
</v-container>
<client-only>
<infinite-loading    spinner="circles"    @infinite="infiniteScroll" ></infinite-loading>
</client-only>
<hr>
   
</div>
</template>

<script>
import {mapState} from 'vuex'
import commentForm from '../post/commentForm'
import textMore from '../post/textMore'

export default {
    props:['postItems'],
    components:{
        // carousel,
        commentForm,
        textMore,
    },
    data(){
        return{
            commentDialog: false,
            comment: '',
            // ...more 
            postText: '',
            len: 120,
            commentToggle: false,

        }
    },

    methods:{
        infiniteScroll($state){
            console.log('Infinite Loading')

            setTimeout(() => {
                this.$store.dispatch('post/loadPost')

            .then((response) => {
                console.log(response)
                if (response > 1) {
                $state.loaded()
                } else {
                $state.complete()
                }
                }).catch((err) => {console.log(err)})
                }, 3000)
        },
        onCommentToggle(id){
            this.commentToggle = !this.commentToggle
        },
        onRemovePost(id){
            this.$store.dispatch('post/removePost', {
                postId: id
            })
        },

        onEditPost(id){
            this.$store.dispatch('post/editPost', id)
        },
    
        removeImage(index){
            this.$store.commit('posts/removeImagePath', index)
        },
        onClickIcon(){
        },
        onCommentSend(){
            this.$store.dispatch('posts/addComment', {
                comment: this.comment
            })
        },
        timeForToday(value) {
            const today = new Date();
            const timeValue = new Date(value);

            const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
            if (betweenTime < 1) return 'Just before';
            if (betweenTime < 60) {
                return `${betweenTime} minutes ago`;
            }

            const betweenTimeHour = Math.floor(betweenTime / 60);
            if (betweenTimeHour < 24) {
                return `${betweenTimeHour} hours ago`;
            }

            const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
            if (betweenTimeDay < 365) {
                return `${betweenTimeDay} days ago`;
            }

            return `${Math.floor(betweenTimeDay / 365)} years ago`;
        },
    
    },

}
</script>

<style scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 4s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(90px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
