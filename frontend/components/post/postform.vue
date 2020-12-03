<template>
<div>
    <div style='padding: 5%;'>
        <div style='text-align: center'>
                <v-btn class=' subtitle-2' text color='blue-grey' >
                    <v-icon class='body-1 pr-2'>mdi-plus</v-icon> post your interest
                </v-btn>
        </div>
        <div class='text-center'>
        <v-form @submit.prevent='onSubmit'  ref='form'> 
            <div class='text-center'>
                <v-textarea  style='width: 90%; margin: 0 auto; font-size: 0.9rem;line-height: 6px;' 
                @input='onChangeTextArea' row-height="12" dense hide-details 
                v-model='text' color='blue-grey' auto-grow outlined clearable >
                </v-textarea>
            </div>
            <br>
            <div class='text-center'>
                <v-btn color='blue-grey white--text' :disabled="lengthCheck(text).length < 5" type='submit' small>POST</v-btn>
            </div>
        </v-form>
    </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data(){
        return{
            text: '',
            valid: true,
            //snackbar
            snackbar: false,
            message: 'Your post have been securely saved',
            timeout: 3000,
        }
    },

    methods:{
        lengthCheck(val){
            if(val === null || val === undefined){
                return ""
            }else{
                return val
            }
        },
        onSubmit(){
            this.$store.dispatch('post/createPost', {
                postContent: this.text,
            }).then(()=>{
                this.text = undefined
                this.snackbar = true
            })
        },
        
        onChangeTextArea(value){
    
        },


        onClickImageUpload() {
        this.$refs.imageInput.click();
        },
        onChangeImages(e) {
            console.log(e.target.files);
            const imageFormData = new FormData();
            [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f);   // { image: [file1, file2] }
            });
            this.$store.dispatch('posts/uploadImages', imageFormData);
        },
        removeImage(index){
            console.log(index)
            this.$store.commit('posts/removeImagePath', index)
        },

        onClickIcon(){
            alert('aaa')
        },
        onSend(){
            alert('send')
        },

        // ...more 만들기
        textLengthOverCut(txt, len, lastTxt) {
        if (len == "" || len == null) { // 기본값
            len = 100;
        }
        if (lastTxt == "" || lastTxt == null) { // 기본값
            lastTxt = "... more";
        }
        if (txt.length > len) {
            txt = txt.substr(0, len) + lastTxt;
        }
        return txt;
    }


    },
    computed:{
        // ...mapState('posts', ['imagePaths']),
    }
}
</script>

<style>

</style>