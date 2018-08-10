<template>
<div class="upload-container">
        <div class="upload-dnd">
        <div 
            @drop.stop.prevent="onDropped($event)" 
            class="drag-n-drop" 
            @click="openPicker()"

            @dragstart="dragging=true"
            @dragenter="dragging=true"
            @drag="dragging=true"
            @dragend="dragging=false"
            @dragover.stop.prevent="dragging=true"
            @dragleave="dragging=false"
            
            :class="{ dragging }">
            <p class="title">{{label}}</p>
            <img class="icon" src="~@/assets/icon/upload.svg">
        </div>
        
        <div class="file-manual">
            <p style="font-weight: 600">or</p>
            <button class="btn-black big" @click="openPicker()">Select a file</button>
            <input @change="onManualFile($event.target)" ref="fileInput" multiple="false" :accept="formats" type="file" style="display: none">
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'file-dropdown',
  data() {
    return {
      dragging: false
    };
  },
  methods: {
    onDropped(event) {
      let dt = event.dataTransfer;
      let files = dt.files;
      this.$emit('file', files[0]);
    },
    openPicker() {
      this.$refs.fileInput.click();
    },
    onManualFile(event) {
      let file = event.files[0];
      this.$emit('file', file);
    }
  },
  props: {
    label: {
      type: String,
      default: 'File'
    },
    formats: {
      type: String
    }
  }
};
</script>