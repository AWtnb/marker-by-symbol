<script setup lang="ts">
import { ref, Ref } from "vue";

const props = defineProps<{ symbol: string; color: string; variation: string[] }>();

const isItalic: Ref<boolean> = ref(false);
const isBold: Ref<boolean> = ref(false);
const color: Ref<string> = ref(props.color);

export interface UpdateStatusPayload {
  symbol: string;
  style: "italic" | "bold";
  status: boolean;
}

export interface UpdateColorPayload {
  symbol: string;
  color: string;
}

const emit = defineEmits<{
  (e: "updateStatus", payload: UpdateStatusPayload): void;
  (e: "updateColor", payload: UpdateColorPayload): void;
}>();

const onItalicInput = () => {
  emit("updateStatus", {
    symbol: props.symbol,
    style: "italic",
    status: isItalic.value,
  });
};
const onBoldInput = () => {
  emit("updateStatus", {
    symbol: props.symbol,
    style: "bold",
    status: isBold.value,
  });
};
const onColorSelected = () => {
  emit("updateColor", {
    symbol: props.symbol,
    color: color.value,
  });
};
</script>

<template>
  <div>{{ symbol }}</div>
  <label><input type="checkbox" v-model="isItalic" @change="onItalicInput" />イタリック</label>
  <label><input type="checkbox" v-model="isBold" @change="onBoldInput" />ボールド</label>
  <label
    ><select v-model="color" @change="onColorSelected">
      <option v-for="(col, idx) in props.variation" :key="idx">
        {{ col }}
      </option></select
    >色</label
  >
</template>
