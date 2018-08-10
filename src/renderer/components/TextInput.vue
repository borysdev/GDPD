<template>
    <div class="form-group">
        <input ref="input"
            class="text-input"
            :placeholder="label"
            @input="$emit('input', $event.target.value);"
            :type="type"
            :disabled="disabled"
            :required='required'
            :class="{ error }"
            :value="value">
        <label
            class="placeholder-main"
            @click.prevent.stop="focus()"
            v-if="label"

            v-text="label"></label>
    </div>
</template>
<script>
export default {
  name: 'text-input',
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  },
  props: {
    disabled: {
      default: false,
      type: Boolean
    },
    type: {
      default: 'text',
      type: String
    },
    value: {
      required: true,
      type: String
    },
    required: {
      type: String,
      default: 'false'
    },
    label: {
      required: false,
      type: String
    },
    error: {
      type: Boolean,
      default: false
    }
  }
};
</script>
