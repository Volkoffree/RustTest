<template>
    <div class="gallery">
        <div class="gallery-album">
            <div class="gallery-album-item" v-for="photo in photoAll" :key="photo.id" >
                <!-- <img v-bind:src="'https://app.rast.ltd/' + photo.image_path" alt=""> -->
                <a href="#" v-bind:style="{ backgroundImage: 'url(' + 'https://app.rast.ltd/' + photo.image_path + ')' }"></a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            photoAll () {
                return this.$store.state.user.info.images.data
            }
        }
        
    }
</script>

<style scoped>
.gallery {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.gallery-album {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
}
.gallery-album-item {
    width: 25vw;
    height: 25vw;
    margin-bottom: 2vw;
}
.gallery-album-item a {
    height: 100%;
    display: inline-block;
    width: 100%;
    background-size: cover;
    background-position: center;

    
}
</style>