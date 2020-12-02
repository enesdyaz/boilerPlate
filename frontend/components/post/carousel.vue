<template>
<div>
    <v-carousel :continuous="true"   :show-arrows="true" height="300" delimiter-icon="mdi-circle-medium">
            <v-carousel-item v-for="p in post.Images" :key='p.id' touch :src="`http://localhost:3071/${p.src}`" >
                <v-row class="fill-height" align="center" justify="center" >
                    <v-btn type='button'  small dark absolute top right center  @click='removeImage(index)'>remove</v-btn>  
                </v-row>
            </v-carousel-item>
    </v-carousel>
    <div>
        
    </div>
</div>
</template>

<script>
export default {
    props:{
        postView:{
            type: Array,
        }
    },
    methods:{
        removeImage(index){
            console.log(index)
            this.$store.commit('posts/removeImagePath', index)
        },
    }
}
</script>

<style>

</style>