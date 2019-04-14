<template>
  <transition name="modal" id="modal-template">
    <div class="modal-mask">
      <div class="modal-wrapper" >
        <button class="modal-default-button" @click="$emit('close')"> </button>
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
            default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            default body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
            default footer
            
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script >


export default {
    data () {
        return {

        }
    }

}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;

}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding: 10px;

}

.modal-container {
  position: relative;
  min-width: 300px;
  max-width: 60%;
  margin: 0px auto;
  padding: 10px 30px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  
      overflow: auto;
      max-height: 97%;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  position: absolute;
  top:10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  background-image: url(../images/close.svg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.complain .modal-container {
  width: 200px;
}
.incognito-window .modal-container {
  width: 350px;
}
.delete-window .modal-container {
  width: 350px;
  padding-bottom: 0;
  padding-top: 25px;
}
.delete-window {

}

</style>