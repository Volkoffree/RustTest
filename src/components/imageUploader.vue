<template>
    <div>
        <img
            v-show="!isEmpty && !isLoading"
            ref="img"
            :src="src"
        >
        <p v-show="!isEmpty && !isLoading" > чот появилось</p>
        <input type="file" @change="previewThumbnail" :id="id" :name="id" accept="image/*" placeholder="hello">
        <!-- {{ file }}
        {{ isLoading }}
        {{ content }} -->
    </div>
</template>

<script>
    export default {
        props: {
            // Filename
            value: {
                type: String,
                default: '',
                twoWay: true
            },
            // Pictures base directory
            srcPrefix: {
                type: String,
                default: '/static/',
            },
            // Component DOM id and name
            id: {
                type: String,
                default: 'picture'
            },
            // Show file info flag
            showInfo: {
                type: Boolean,
                default: false
            },
            // Clear flag
            allowClear: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                content: null,
                file: null,
                isLoading: false,
                isDragging: false
            }
        },
        methods: {
            sync (e) {
                e.preventDefault();
                this.newPost.infos.images = e.target.files[0];
                // console.log(this.newPost.infos.images)
            },
            clearValue () {
                this.file = null;
                this.isLoading = false;
                this.isDragging = false;
                // Dispatch input events with empty value and image content
                this.dispatchInputEvents('', null);
            },
            previewThumbnail (event) {
                this.handleFiles(event.target.files)
            },
            handleFiles (files) {
                if (!files || !files[0]) {
                    return;
                }
                if (!/^image\//.test(files[0].type)) {
                    return;
                }
                this.selectImage(files[0]);
            },
            selectImage (file) {
                let reader = new FileReader();
                // Set new image load handler
                reader.onload = this.onImageLoad;
                this.isLoading = true;
                this.file = file;
                reader.readAsDataURL(file);
            },
            onImageLoad (e) {
                this.content = e.target.result;
                this.isLoading = false;
                let filename = this.file instanceof File
                    ? this.file.name
                    : '';                
                // Dispatch input events with new value and image content
                this.dispatchInputEvents(filename, this.content);
            },
            onDragEnter (e) {
                e.stopPropagation();
                e.preventDefault();
                this.isDragging = true;
            },
            onDragOver (e) {
                e.stopPropagation();
                e.preventDefault();
            },
            onDrop (e) {
                e.stopPropagation();
                e.preventDefault();
                this.isDragging = false;
                if (e.dataTransfer.files && App.eventOnElement(e, this.$refs.mainContainer)) {
                    this.handleFiles(e.dataTransfer.files);
                }
            },
            dropOff (e) {
                e.stopPropagation();
                e.preventDefault();
                this.isDragging = false;
            },
            dragOff (e) {
                e.stopPropagation();
                e.preventDefault();
                if (!App.eventOnElement(e, this.$refs.mainContainer)) {
                    this.isDragging = false;
                }
            },
            dispatchInputEvents(filename, content) {
                // Dispatch new input event with new value
                this.$emit('input', filename);
                // Dispatch new event for parent with new image content
                this.$emit(this.events.IMAGE_CHANGED, content);
            }
        },
        computed: {
            events () {
                return {
                    IMAGE_CHANGED: 'image-changed'
                };
            },
            src () {
                if (this.content) {
                    return this.content;
                }
                return this.isEmpty
                        ? ''
                        : this.srcPrefix + this.value;
            },
            fileInfo () {
                if (this.isEmpty) {
                    return '';
                }
                let result = this.value;
                if (this.file instanceof File) {
                    result += "\n." + this.file.type.split('/')[1] + "\n"
                        + FileHelper.formatSize(this.file.size);
                }
                if (this.width > 0) {
                    result += "\n" + this.width + 'x' + this.height + 'px';
                }
                return result;
            },
            isEmpty () {
                return !Boolean(this.value);
            }
        },
        // mounted () {
        //     this.$refs.mainContainer.addEventListener('dragenter', this.onDragEnter, true);
        //     this.$refs.mainContainer.addEventListener('dragover', this.onDragOver, true);
        //     this.$refs.mainContainer.addEventListener('drop', this.onDrop, true);
        //     // Add screen wrapper listeners to stop drag-n-drop
        //     this.$refs.dragNDropScreenWrapper.addEventListener('drop', this.dropOff);
        //     this.$refs.dragNDropScreenWrapper.addEventListener('dragleave', this.dragOff);
        // }
    }
</script>

<style scoped>

</style>