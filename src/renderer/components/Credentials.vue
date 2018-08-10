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
      login: '',
      pass: ''
    };
  },
  methods: {
    onSubmit() {
      this.$linkedin.login = this.login;
      this.$linkedin.password = this.pass;
      console.log(this.$linkedin);
      this.$router.push({ name: 'Processing' });
    }
  },
  created() {
    if(!this.$linkedin.list) return this.$router.push({ name: "Homepage" })
      this.login = this.$linkedin.login;
      this.pass = this.$linkedin.password;
  },
  components: {
    TextInput
  }
};
</script>