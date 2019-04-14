<template>
    <div class="emojis">
        <button class="emoji-btn" @click="emojisWindow = true"></button>
        <div 
        v-if="emojisWindow"
        v-on-clickaway="closeEmojisWindow"
        class="emojis-window"
        >
            <div
            v-for="(category, categoryName) in allEmojis"
            :key="category.id"
            class="emojis-window-category"
            >   
                <h4>{{ categoryName }}</h4>
                <div
                class="emojis-window-category-items"
                >
                    <div 
                    v-for="emoji in category"
                    :key="emoji.id"
                    class="emojis-window-category-items-item"
                    @click="insert"
                    > {{ emoji }} </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import emojis from './emojis'
import { mixin as clickaway  } from 'vue-clickaway'

    export default {
        data () {
            return {
                input: '',
                emojisWindow: false
            }
        },
        computed: {
            allEmojis () {
                return emojis
            },
        },
        mixins: [ clickaway ],
        methods: {
            insert (emoji) {
                this.input += emoji.target.innerText
                this.$emit('emoji', emoji.target.innerText)
            },
            closeEmojisWindow () {
                this.emojisWindow = false

            }
        }
    }
</script>

<style>
.emojis {
    position: relative;
}

.emoji-btn {
    border: none;
    background:none;
    width: 23px;
    height: 23px;
    margin-left: 5px;
    background-image: url(../images/emoji.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}
.emojis-window {
    position: absolute;
    width: 300px;
    height: 200px;
    padding: 10px;
    right: -100%;
    overflow-y: scroll;
    -webkit-box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    z-index: 101;
    background-color: #fff;
}

.wall-posts-post-footer .emojis-window {
    top: -200px;
}
.emojis-window-category {
    padding: 10px;
    overflow: hidden;

}
.emojis-window-category-items {
    display: flex;
    flex-wrap: wrap;

}
.emojis-window-category-items-item {
    cursor: pointer;
}
</style>