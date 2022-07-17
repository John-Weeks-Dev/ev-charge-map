<template>
  <div id="range-slide-container">
    <div class="range">
      <div class="row">
        <div class="text-body1">
          Search Range
        </div>
        <div class="text-body1">
          Miles: {{ data.range }}
        </div>
      </div>
      <input type="range" min="1" max="10" v-model="data.range" class="slider">
    </div>
  </div>
</template>

<script setup>
// IMPORTS
import { reactive, watch } from 'vue'
// IMPORTS END

// PROPS
const props = defineProps({ range: { type: Number, default: 1 } })
const data = reactive({ range: props.range })
// PROPS END

// EMITS
const emit = defineEmits(['range'])
// EMITS END

watch(() => data.range, () => emit('range', Number(data.range)))

// METHODS

// METHODS END
</script>

<style lang="scss">
#range-slide-container {
  width: 100%;

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 7px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $dark;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }

  .range {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: 500;
  }

  .row {
    display: flex;
    font-weight: 500;
    padding: 10px;
    font-size: 15px;
    justify-content: space-between;
  }
}
</style>
