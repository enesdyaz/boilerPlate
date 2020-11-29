<template>
<div>
            <div class='d-flex'>
                <v-btn text class='body-2' to="/"><v-icon style='font-size: 1rem;'>mdi-chevron-left</v-icon> BACK</v-btn>
                <v-spacer></v-spacer>
                <v-btn to='/auth/signup' text class='body-2'>signup<v-icon style='font-size: 1rem;'>mdi-chevron-right</v-icon> </v-btn>
            </div>

            <v-row class='mt-4' style='margin: 0 auto;'>
                <v-col>
                    <div class='mx-auto text-center' Elevation='8'  height='600' max-width='370'>
                        <br>
                        <div class='d-inline-block'>
                            <v-img width="150" src="/logo/logo-black.png"></v-img>

                        </div>
                        <br><br><br><br>
                        <v-btn text color='primary' class='subtitle'>login into wizeto </v-btn> 
                        
                        <div class='caption pa-2'>Enter your details to log in to your account or Use your SNS account to sign in.</div>
                        <br><br>
                        
                        <v-btn  text outlined  @click='dialog = !dialog'><v-img class='mr-8' width='20' src='/logo/email.png'></v-img>Signin with e-mail<span style='width: 20px;'></span></v-btn>
                        <transition name="slide-fade">

                        <div v-if='dialog'>
                        <br>
                            <div style='width: 400px; margin: 0 auto;'>
                                <v-form v-model='valid' ref='form' @submit.prevent = 'onSubmit'>
                                    <v-text-field type='email' :rules='emailRule' v-model='email' style='width:80%; margin: 0 auto;' outlined hide-details dense placeholder='harry@wizeto.com'></v-text-field>    
                                    <v-text-field type='password' :rules='passwordRule' v-model='password' style='width:80%; margin: 0 auto;' outlined hide-details dense placeholder='Password'></v-text-field>    
                                    <div>
                                        <v-btn class='mt-4 blue-grey white--text' :disabled="!valid" small outlined type='submit' >Sign in</v-btn>
                                    </div>
                                </v-form>
                            </div>
                        </div>
                        </transition>
                        <br><br>
                        <v-divider></v-divider>
                        <br>
                        <div>
                            <v-btn text outlined class='subtitle' ><v-img class='mr-8' width='16' src='/logo/facebook.png'></v-img> Signin with Facebook</v-btn>
                        </div>
                        <div>
                            <v-btn text outlined class='subtitle mt-2 pr-4'><v-img class='mr-8' width='16' src='/logo/gmail.png'></v-img> Signin with Gmail <span style='width: 30px;'></span></v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row> 
</div>
</template>

<script>
export default {

    layout: 'landing',
    data(){
        return{
            dialog: false,
            email: '',
            password: '',
            valid: false,

            emailRule: [
                v => !!v || 'An email is required',
                v => /.+@.+/.test(v) || 'the email is not valid'
            ],
            passwordRule: [
                v => !!v || 'A password is required'
            ],
        }
    },
    methods:{
        onSubmit(){
            this.$store.dispatch('user/login', {
                email: this.email,
                password: this.password
            })
        }
    },
    computed: {
        me(){
                return this.$store.state.user.me
            }
    },
    watch: {
        me(value) {
            if (value) {
            this.$router.push({
                path: `/setup`,
            });
            }
        }
    },
}
</script>


<style lang="scss" scoped>
    slide-fade-enter-active {
    transition: all .1s ease;
    }
     .slide-fade-enter-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(80px);
    opacity: 0;
    }
</style>
