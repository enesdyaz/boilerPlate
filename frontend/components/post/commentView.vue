<template>
<div>
    <!-- <div class='caption pl-3 pt-2' style='width: 95%;' v-for="comment in commentItem" :key="comment.id">
        <div style='float: left; width: 17px;'><v-icon class='body-2 blue-grey--text '>mdi-account-circle-outline</v-icon></div>
        <div style="float: left; width: 90%"><span class='font-weight-bold blue-grey--text'>{{comment.User.username}}- </span>{{comment.commentContent}}</div>
        <div class='pl-4 blue-grey--text' style='clear: both'>{{timeForToday(comment.createdAt)}} <span><v-btn x-small text color='blue-grey'> REPLY</v-btn></span>
        </div>
    </div> -->

    <div>
        <v-virtual-scroll :items="commentItem" :item-height="50" height="300" >
            <template v-slot="{ item }">

                <div class='caption pl-3 pt-2' style='width: 95%;'>
                    <div style='float: left; width: 17px;'><v-icon class='body-2 blue-grey--text '>mdi-account-circle-outline</v-icon></div>
                    <div style="float: left; width: 90%"><span class='font-weight-bold blue-grey--text'>{{item.User.username}}- </span>{{item.commentContent}}</div>
                    <div class='pl-4 blue-grey--text' style='clear: both'>{{timeForToday(item.createdAt)}} <span><v-btn x-small text color='blue-grey'> REPLY</v-btn></span>
                    <v-menu style='display: inline-block;' :close-on-content-click="true" dense :nudge-width="60"  offset-y >
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" class='ml-4' style='font-size: 1.2rem;'>mdi-dots-horizontal</v-icon>
                        </template>

                        <div class='text-left pr-4' style='background: whitesmoke;'>
                            <v-btn x-small @click='onRemovePost(post.id)' text><v-icon style='font-size: 1rem;padding-right: 4px;'>mdi-trash-can-outline</v-icon> REMOVE</v-btn><br>
                            <v-btn x-small @click='onEditPost(post.id)' text><v-icon style='font-size: 1rem;padding-right: 4px;'>mdi-pencil-outline</v-icon> EDIT</v-btn>
                        </div>
                    </v-menu>
                    </div>
                </div>
                
            </template>
        </v-virtual-scroll>
    </div>


</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    props:{
        post:{
            type: Number,
            required: true
        }
    },
    created(){
        this.$store.dispatch('post/loadComment', {
            postId: this.post
        })
    },
    computed:{
        ...mapState('post', ['commentItem'])
    },
    methods:{
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
            return `${betweenTimeHour} hour ago`;
        }

        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay} day ago`;
        }

        return `${Math.floor(betweenTimeDay / 365)} year ago`;
        }      
    }
}
</script>

<style>

</style>