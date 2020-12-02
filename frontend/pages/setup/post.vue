<template>
    <div>
        <div :class='{active: !isActive}' class='leftBox' style='overflow:auto; height: 100vh;'>
            <post-form></post-form>
            <post-view></post-view>
            

        </div>

        <div class='rightBox'>
            <v-row  justify='center' align='center' class='d-none d-sm-flex'>
            <v-col>
                <!-- <mobile-phone></mobile-phone> -->
                
            </v-col>
            </v-row>
        </div>
        

        <div :class='{active: isActive}'  class='d-sm-none' >
                <!-- <phone-view></phone-view> -->
        </div>

        <div class='bottomNavigation d-sm-none'>
            <div class='bottomAdmin'><v-btn text class='body-2' @click='admin'><v-icon style='font-size: 1.2rem;'>mdi-cog-outline</v-icon><span style='font-size: 0.8rem;'>setting</span></v-btn> </div>
            <div class='bottomView'><v-btn text class='body-2'  @click='view' ><v-icon style='font-size: 1.2rem;'>mdi-view-day</v-icon> <span style='font-size: 0.8rem;'>view</span></v-btn></div>
        </div>
    </div>
</template>

<script>
// import MobilePhone from '../../components/setup/MobileIphone'
import postForm from '../../components/post/postform'
// import postView from '../../components/setup/post/postView'

export default {
    data() {
        return {
            isActive: true
        }
    },
    components: {
        // MobilePhone,
        postForm,
        // postView, 

    },
    fetch({store}){
        return store.dispatch('post/loadPost')
    },
    methods: {
        admin(){
        this.isActive = true;
        },
        view(){
        this.isActive = false
        }
    },
    computed:{
        // postView(){
        //     return this.$store.state.posts.postView
        // }
    },

}
</script>

<style lang='scss' scoped>

.leftBox{
    width: 50%;
    float: left;
    overflow: scroll;
}

.rightBox{
    width: 50%;
    float: left;
    margin-top: 0;
    overflow: scroll;
}



@media only screen and (max-width: 600px) {
    body {
        background-color: lightblue;
    }
    .active{
    display: none;
    }

    .leftBox{
    width: 100%;
    }

    .bottomNavigation{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #cfd8dc;
    z-index: 99999999;
    height: 5vh;
    
    .bottomAdmin{
        float: left;
        width: 50%;
        border: 1px solid whitesmoke;
        text-align: center;
    }
    .bottomView{
    @extend .bottomAdmin
    }
    }
}


</style>