<template>
        <div class="credentials-container">
          <h3>LinkedIn credentials</h3>
          <form @submit.stop.prevent="onSubmit()">
            <text-input v-model="login" required="true" name="login" label="Login" />
            <text-input v-model="pass" required="true" type="password" name="password" label="Password" />
            <button class="btn-black" type="submit">Parse list</button>
          </form>
        </div>      
</template>
<script>
import TextInput from './TextInput';

export default {
  name: 'credentials',
  uses: ['linkedin'],
  data() {
    return {
      login: "",
      pass: ""
    };
  },
  methods: {
    async onSubmit() {
      try {
        await this.$linkedin.authorize(this.login, this.pass);
        console.log("Logged in successful")
      }catch(e) {
        console.log(e);
        return alert("Bad credentials");
      }
      this.$router.push({ name: 'Processing' });
    }
  },
  created() {
    if(!this.$linkedin.list) return this.$router.push({ name: "Homepage" })
  },
  components: {
    TextInput
  }
};
</script>