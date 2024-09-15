<script setup lang="ts">
import { ref, Ref, watch, reactive, computed } from "vue";
import SymbolSelector from "./SymbolSelector.vue";
import { UpdateStatusPayload, UpdateColorPayload } from "./SymbolSelector.vue";

import { Decorator, blankPara } from "../helpers/Decorator.ts";

const rawStr: Ref<string> = ref("これは▲文字▲を\n●記号●で■装飾■できる\n\nツールです。");

const fontSize: Ref<number> = ref(10.5);
const markup: Ref<string> = ref("");
const plain: Ref<string> = ref("");

const SYMBOLS = reactive([
  { symbol: "●", color: "Yellow", italic: false, bold: false },
  { symbol: "▲", color: "Cyan", italic: false, bold: false },
  { symbol: "■", color: "Lime", italic: false, bold: false },
  { symbol: "★", color: "Pink", italic: false, bold: false },
]);

const colors: Ref<string[]> = computed(() => {
  return ["Yellow", "Cyan", "Lime", "Pink"];
});

const toEntry = (s: string): string => {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

const reset = () => {
  markup.value = "";
  plain.value = "";
};

const format = () => {
  reset();
  rawStr.value
    .split(/\n/)
    .map((s) => toEntry(s))
    .forEach((line: string) => {
      if (line.length < 1 || line.trim().length < 1) {
        markup.value += blankPara;
        plain.value += "\n";
        return;
      }
      const de = new Decorator(line);
      SYMBOLS.forEach((sym) => {
        de.decorate(sym.symbol, sym.color, sym.italic, sym.bold);
      });
      markup.value += de.getMarkupText(fontSize.value);
      plain.value += de.getPlainText();
    });
};

const copyStatus: Ref<boolean> = ref(false);

watch([rawStr, SYMBOLS, fontSize], () => {
  copyStatus.value = false;
});

const copyToClipboard = () => {
  format();

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

const onStatusUpdated = (payload: UpdateStatusPayload) => {
  const t = SYMBOLS.filter((z) => z.symbol == payload.symbol)[0];
  if (payload.style == "italic") {
    t.italic = payload.status;
  }
  if (payload.style == "bold") {
    t.bold = payload.status;
  }
};

const onColorSelected = (payload: UpdateColorPayload) => {
  const t = SYMBOLS.filter((z) => z.symbol == payload.symbol)[0];
  t.color = payload.color;
};
</script>

<template>
  <div v-for="(s, idx) in SYMBOLS" :key="idx">
    <symbol-selector :symbol="s.symbol" :color="s.color" :variation="colors" @update-status="onStatusUpdated" @update-color="onColorSelected"></symbol-selector>
  </div>
  <label><input type="number" v-model="fontSize" step="0.5" />pt</label>
  <div class="ta"><textarea v-model="rawStr"></textarea></div>
  <button type="button" @click="copyToClipboard" :class="{ copied: copyStatus }">COPY</button>
</template>

<style scoped>
button.copied::after {
  content: "\2705";
}
.ta textarea {
  min-height: 200px;
}
</style>
