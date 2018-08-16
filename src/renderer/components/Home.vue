<template>
    <div id="homepage">
        <h3 class="big" style="text-align: center">Add New List to Process</h3>
        <file-dropdown label="Drag & Drop Input File here" @file="onFile($event)" formats=".json" />
    </div>
</template>
<script>
import FileDropdown from './FileDropdown';

export default {
  name: 'home',
  uses: ['linkedin'],
  components: {
    FileDropdown
  },
  methods: {
    onFile(file) {
      this.$linkedin.parseInitialList(file);
      this.$router.push({ name: 'Credentials' });
    }
  }
};
</script>



