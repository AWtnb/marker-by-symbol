<script setup lang="ts">
import { ref, Ref, onMounted, computed } from "vue";
import { JpColor, SymbolColor, JpColorNames, ToHtmlColorName } from "../helpers/ColorTable.ts";

const props = defineProps<{ symbol: string }>();

const isItalic: Ref<boolean> = ref(false);
const isBold: Ref<boolean> = ref(false);
const color: Ref<string> = ref(SymbolColor.get(props.symbol) || JpColor.Transparent);

export interface UpdateStylePayload {
  symbol: string;
  italic: boolean;
  bold: boolean;
}

export interface UpdateColorPayload {
  symbol: string;
  color: string;
}

const emit = defineEmits<{
  (e: "updateStatus", payload: UpdateStylePayload): void;
  (e: "updateColor", payload: UpdateColorPayload): void;
}>();

const colorName: Ref<string> = computed(() => {
  return ToHtmlColorName(color.value);
});

const onStyleUpdated = () => {
  emit("updateStatus", {
    symbol: props.symbol,
    italic: isItalic.value,
    bold: isBold.value,
  });
};

const setColor = () => {
  emit("updateColor", {
    symbol: props.symbol,
    color: colorName.value,
  });
};

onMounted(setColor);
</script>

<template>
  <div :style="{ background: colorName }">{{ symbol }}</div>
  <label><input type="checkbox" v-model="isItalic" @change="onStyleUpdated" />イタリック</label>
  <label><input type="checkbox" v-model="isBold" @change="onStyleUpdated" />ボールド</label>
  <label
    ><select v-model="color" @change="setColor">
      <option v-for="(col, idx) in JpColorNames" :key="idx">
        {{ col }}
      </option></select
    ></label
  >
</template>
