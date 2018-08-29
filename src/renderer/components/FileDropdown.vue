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
            <p class="title">Upload initial list.json</p>
        </div>
        
        <div class="file-manual">
            <button class="btn" style="margin-top: 32px; padding: 8px 64px; font-size: 20px;" @click="openPicker()">Upload</button>
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