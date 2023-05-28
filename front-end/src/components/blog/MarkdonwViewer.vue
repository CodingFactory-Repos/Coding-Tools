<template>
  <div class="codeLab">
    <input type="file" accept=".md" @change="handleFileChange" />
    <div v-if="fileContent !== ''" v-html="renderedMarkdown"></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export default {
  name: 'MarkdownViewer',
  data() {
    return {
      fileContent: '',
      renderedMarkdown: '',
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.fileContent = reader.result;
          this.renderMarkdown();
        };
        reader.readAsText(file);
      }
    },
    renderMarkdown() {
      const md = new MarkdownIt({
        highlight(code, lang) {
        let highlightedCode = code;

        if(hljs.getLanguage(lang)){
            highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        }

        return `<pre class='hljs'><code>${highlightedCode}</code></pre>`
    },
      });

      this.renderedMarkdown = md.render(this.fileContent);
    },
  },
};
</script>

<style lang="scss">
  @import 'node_modules/highlight.js/styles/atom-one-dark.css';

  .codeLab{
    max-width: 60%;
    margin: 0 auto;
    line-height: 1.5em;
  }
</style>
