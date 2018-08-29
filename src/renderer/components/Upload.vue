<template>
    <div class="card" style="justify-content: space-between">
        <h3>Upload file</h3>
        <section>
          <file-dropdown @file="onFile($event)" formats=".json" />
        </section>
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