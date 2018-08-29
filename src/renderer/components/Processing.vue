<template>
    <div class="card">
        <h3 class="big" style="text-align: center">Processing list</h3>
        <div class="animate">
          <img src="~@/assets/icon/refresh.svg">
        </div>
        <div style="width: 200px" class="progress-container">
            <div class="bar"></div>
            <div :style="`width: ${percents}%`" class="progress-bar"></div>
            <p class="percents">{{progress}}%</p>
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
        console.log('Logged in successful');
      } catch (e) {
         alert(e);

         return this.$router.push({ name: "Upload" });
      }
      file = await this.$linkedin.processInitialList();
    } catch (e) {
      alert(e);
      return this.$router.push({ name: 'Homepage' });
    }
    this.$progress.finish();
    this.$router.push({ name: 'Download' });
//    this.finishProcessing(file);
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