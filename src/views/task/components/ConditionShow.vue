<template>
  <div>
    <p v-for="(orForm, orIdx) in conditions" :key="orIdx" class="condition-item">
      <slot name="header"></slot>
      <span v-if="orIdx != 0">
        <code class="highlight">或</code>
      </span>
      [
      <span v-for="(andForm, andIdx) in orForm[ruleKey]" :key="andIdx">
        <template v-if="andIdx != 0">
          <code class="highlight">且</code>
        </template>
        <code>
          {{ andForm.field }} {{ operators[andForm.operator] }}
          <template v-if="!noThreshold(andForm.threshold)">
            {{ andForm.threshold }}
          </template>
        </code>
      </span>
      ]
    </p>
  </div>
</template>

<script>
import { operators, noThreshold } from '@/consts/alarm'

export default {
  name: 'ConditionsShow',
  props: {
    conditions: {
      type: Array,
      required: true
    },
    ruleKey: {
      type: String,
      default: 'rule'
    }
  },
  components: {

  },
  data () {
    return {
      operators,
      noThreshold
    }
  }
}
</script>

<style lang="scss" scoped>
.condition-item {
  margin: 0;
}
</style>
