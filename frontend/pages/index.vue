<template>
    <v-app>

<!-- header --> 
        <header class='headerContent'>

            <div class='headerMenu d-flex pa-4'>
                <div><v-img src='/default.png' width='30'></v-img></div>
                <div class='text-button pl-2' style='color: #546E7A' >wizeto</div>
                <v-spacer></v-spacer>
                <div class='d-none d-sm-flex mt-2'><v-btn small text> Documentation</v-btn></div>
                <div class='d-none d-sm-flex mt-2'><v-btn small text> Product</v-btn></div>
                <div class='d-none d-sm-flex mt-2'><v-btn small text> Pricing</v-btn></div>
                <div class='d-none d-sm-flex mt-2'><v-btn small text> </v-btn></div>

                <div><v-btn text outlined to='auth/signup' color='green'> Signup</v-btn></div>
                <div><v-btn text to='/auth/login'> Login</v-btn></div>
                <div class='d-sm-none'><v-icon @click.stop="drawer = !drawer" right style='margin-top: 6px;'>mdi-menu</v-icon></div>

            </div>

            <section class='headerSection1'>
              <v-row no-gutters>
                <v-col cols='12' sm='6'>
                    <div class='section1Left' style='padding: 10%;' >
                        <div class='text-h4 mt-sm-4 font-weight-bold'>All you need to do is show up at the right time.</div>
                        <br>
                        <div class='text-lg-h6 font-weight-medium'>Wizeto is your online assistant, working 24/7 to fill your booking, schedule, all you need.</div>
                    </div>
                </v-col>
                <v-col cols='12' sm='6'>
                    <div class='section1Right mt-sm-16 mt-md-0' style='padding: 10%;'>
                      <v-img src='/screenShot.png'></v-img>
                    </div>
                </v-col>
              </v-row>
            </section>
        </header>
        
 



        <div><nuxt /></div>
    </v-app>
</template>

<script>
export default {
layout: 'landing',
data () {
    return {
    drawer: false,
    profileImage: '/v.png',
    items: [
        {
        icon: 'mdi-chevron-down',
        title: 'Home',
        to: '/'
        },
        {
        icon: 'mdi-chevron-down',
        title: 'Service',
        to: '/inspire'
        }
    ],

    title: 'Wizeto'
    }
}
}
</script>

<style lang='scss' scoped>
.headerContent{
    background: #FFEBEE;
}
.headerSection1{
    
    .section1Left{
        
    }
    .section1Right{
       @extend .section1Left;
    }
}
</style>