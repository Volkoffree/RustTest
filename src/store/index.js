import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: {
            info: {
                images: {
                    data: ''
                },
                user_info: {
                    user_id: ''
                }
            }
        },
        comments: ['hello'],
        posts: [],
        postsFiltred: []
    }
})