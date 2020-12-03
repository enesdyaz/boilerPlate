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
                <div v-if="imagePaths.length < 1 || imagePaths.length === undefined"  style='margin-bottom: 15px;margin-top: 10px;' class='circle'>
                    <input ref="imageInput"  type="file"  multiple hidden @change="onChangeImages">
                    <v-btn type="button" @click="onClickImageUpload" text><v-icon color='blue-grey'>mdi-camera</v-icon></v-btn>
                </div>

                <div v-else>
                    <div style='padding: 5%'>
                        <v-carousel :continuous="true"   :show-arrows="true" height="300"
                            delimiter-icon="mdi-circle-medium">
                                <v-carousel-item v-for="(image, index) in imagePaths" :key='index'  touch :src="`http://localhost:3085/${image}`" >
                                    <v-row class="fill-height" align="center" justify="center" >
                                        <v-btn type='button'  small dark absolute top right center  @click='removeImage(index)'>remove</v-btn>  
                                    </v-row>
                                </v-carousel-item>
                            </v-carousel>
                    </div>
                </div>




                <v-textarea  style='width: 90%; margin: 0 auto; font-size: 0.9rem;line-height: 6px;' 
                 row-height="12" dense hide-details 
                v-model='text' color='blue-grey' auto-grow outlined clearable >
                </v-textarea>
            </div>
            <br>
            <div class='text-center'>
                <v-btn color='blue-grey white--text' :disabled="lengthCheck(text).length < 5" type='submit' small>POST</v-btn>
            </div>
        </v-form>
    </div>
        <v-snackbar top v-model="snackbar" :timeout="timeout"> {{ message }}
                        <template v-slot:action="{ attrs }">
                            <v-btn color="blue" text  v-bind="attrs" @click="snackbar = false" > Close </v-btn>
                        </template>
        </v-snackbar>
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
            message: '',
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
                this.message= 'Your post have been securely saved'
                this.snackbar = true
            })
        },


        onClickImageUpload() {
        this.$refs.imageInput.click();
        },

        onChangeImages(e) {
            let i = 0
            e.target.files.forEach(e=> i = i + e.size) 

            if(i>3000000){   // 3Mb
                console.log(i)
                this.message = 'Please upload less than 3 Mb'
                this.snackbar = true 
            }else{
                const imageFormData = new FormData();
                [].forEach.call(e.target.files, (f) => {
                imageFormData.append('image', f);   // { image: [file1, file2] }
                });
                console.log(imageFormData)
                this.$store.dispatch('post/uploadImages', imageFormData);
            }
        },
 
        removeImage(index){
            console.log(index)
            this.$store.commit('post/REMOVE_IMAGE_PATH', index)
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
        ...mapState('post', ['imagePaths']),
    }
}
</script>

<style lang="scss" scoped>
.circle{
    display: inline-block;
    width: 70px;
    height: 70px;
    border: 3px dotted #607D8A;
    border-radius: 50%;
    line-height: 65px;
}
</style>