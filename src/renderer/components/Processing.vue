<template>
    <div>
        <h3 class="big" style="text-align: center">List Processing</h3>
        <div class="progress-container">
            <div :style="`width: ${percents}%`" class="progress-bar">
                <p class="percents">{{progress}}%</p>
            </div>
        </div>  
    </div>
</template>
<script>
import { remote } from 'electron';
import * as fs from 'fs';

export default {
  name: 'processing',
  uses: ['linkedin', 'progress'],
  methods: {
    finishProcessing(list) {
      let saveTo = remote.dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      if (saveTo && saveTo.length > 0) {
        fs.writeFileSync(
          `${saveTo[0]}/Parsed ${list.name}.json`,
          JSON.stringify(list)
        );
      }
      this.$router.push({ name: 'Homepage' });
    }
  },
  async created() {
    if (!this.$linkedin.list) return this.$router.push({ name: 'Homepage' });
    let file;
    try {
      try {
        await this.$linkedin.authorize();
        console.log("Logged in successful")
      }catch(e) {
        console.log(e);
        alert(e);
        alert("Bad credentials");
        return this.$router.push({ name: "Credentials" });
      }
      file = await this.$linkedin.processInitialList();
    } catch (e) {
      alert(e);
      return this.$router.push({ name: 'Homepage' });
    }
    this.$progress.finish();
    this.finishProcessing(file);
  },
  computed: {
    percents() {
      return this.$progress.value > 5 ? this.$progress.value : 5;
    },
    progress() {
      return Math.floor(this.$progress.value);
    }
  }
};
</script>