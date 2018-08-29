<template>
    <div class="card">
        <h3>Save file</h3>
        <section>
          <div class="download">
            <p>Parsed {{$linkedin.list.name}}.json</p>
          </div>
        </section>
        <div>
          <a style="margin-bottom: 64px;" class="btn" @click="download()">Save file</a>
        </div>       
        
    </div>
</template>
<script>
import { remote } from 'electron';
import * as fs from 'fs';

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