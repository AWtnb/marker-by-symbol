<script setup lang="ts">
import { ref, Ref, watch, reactive } from "vue";
import SymbolSelector from "./SymbolSelector.vue";
import { UpdateStylePayload, UpdateColorPayload } from "./SymbolSelector.vue";

import { ExecuteMarkup, ToPlainText } from "../helpers/Decorator.ts";
import { SymbolTable, SymbolMarks } from "../helpers/ColorTable.ts";

const rawStr: Ref<string> = ref("これは●文字●を\n▲記号▲で■装飾■できる\n\n★ツール★です。");

const fontSize: Ref<number> = ref(10.5);
const markup: Ref<string> = ref("");
const plain: Ref<string> = ref("");

const symbolTable = reactive(SymbolTable());

const reset = () => {
  markup.value = "";
  plain.value = "";
};

const executeFormat = () => {
  reset();
  markup.value = ExecuteMarkup(rawStr.value, fontSize.value, symbolTable);
  plain.value = ToPlainText(rawStr.value);
};

const copyStatus: Ref<boolean> = ref(false);

watch([rawStr, symbolTable, fontSize], () => {
  copyStatus.value = false;
});

const copyToClipboard = () => {
  executeFormat();

  const blobHtml = new Blob([markup.value], { type: "text/html" });
  const blobText = new Blob([plain.value], { type: "text/plain" });
  const data = [
    new ClipboardItem({
      ["text/plain"]: blobText,
      ["text/html"]: blobHtml,
    }),
  ];

  navigator.clipboard.write(data).then(
    () => {
      copyStatus.value = true;
    },
    () => {}
  );
};

const onStatusUpdated = (payload: UpdateStylePayload) => {
  const target = symbolTable.get(payload.symbol);
  if (target) {
    target.italic = payload.italic;
    target.bold = payload.bold;
  }
};

const onColorSelected = (payload: UpdateColorPayload) => {
  const target = symbolTable.get(payload.symbol);
  if (target) {
    target.color = payload.color;
  }
};
</script>

<template>
  <div id="content"><textarea v-model="rawStr"></textarea></div>
  <div id="symbol-selectors">
    <symbol-selector v-for="(sm, idx) in SymbolMarks" :key="idx" :symbol="sm" @update-status="onStatusUpdated" @update-color="onColorSelected"></symbol-selector>
  </div>
  <div id="controls">
    <label><input type="number" v-model="fontSize" step="0.5" />pt</label>
    <button type="button" @click="copyToClipboard" :class="{ copied: copyStatus }">COPY</button>
  </div>
</template>

<style scoped>
button.copied::after {
  content: "\2705";
}
#content textarea {
  min-height: 200px;
  margin-bottom: 1em;
}
#symbol-selectors {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1em;
}
#controls {
  display: flex;
  justify-content: space-between;
}
#controls label {
  width: 50%;
  align-items: center;
  display: flex;
}
</style>
