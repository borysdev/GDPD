<template>
    <div class="card">
        <h3>Upload file</h3>
        <file-dropdown @file="onFile($event)" formats=".json" />
    </div>
</template>
<script>
import FileDropdown from "./FileDropdown";
export default {
  name: "upload",
  uses: ['linkedin'],
  methods: {
    onFile(file) {
      this.$linkedin.parseInitialList(file);
      this.$router.push({ name: 'Processing' });
    }
  },
  components: {
    FileDropdown
  }
};
</script>