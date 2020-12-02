<template>
<div style='white-space: pre-line:'>
    <div v-if="postContent.length > 100 " >
        {{postContent.substr(0, len)}} <span style='cursor: pointer;' v-if="len<1000" @click="len=1000">... more</span>
    </div>
    <div v-else >{{postContent}}</div>
</div>
</template>

<script>
export default {
    props:{
        postContent:{
            type: String,
            required: true
        }
    },
    data(){
        return{
            len: 120,
        }
    }
}
</script>