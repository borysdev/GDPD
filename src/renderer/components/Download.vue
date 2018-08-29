<template>
    <div class="card">
        <h3>Save file</h3>
        <div class="download">
            Download Parsed {{$linkedin.list.name}}.json
        </div>
        <div class="big" style="">
            <a @click="download()">Save file</a>
        </div>
    </div>
</template>
<script>
export default {
  name: "download",
  uses: ["linkedin"],
  methods: {
    download() {
      let saveTo = remote.dialog.showOpenDialog({
        properties: ["openDirectory"]
      });
      if (saveTo && saveTo.length > 0) {
        fs.writeFileSync(
          `${saveTo[0]}/Parsed ${this.$linkedin.list.name}.json`,
          JSON.stringify(this.$linkedin.list)
        );
      }
      this.$router.push({ name: "Upload" });
    }
  }
};
</script>