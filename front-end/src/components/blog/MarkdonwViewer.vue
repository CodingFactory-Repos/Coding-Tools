<template>
  <div class="codeLab">
    <input type="file" accept=".md" @change="handleFileChange" />
    <!-- <div v-if="fileContent !== ''" v-html="renderedMarkdown"></div> -->
    <div v-for="(data, index) in resultArray" :key="index">
      <div v-for="(line, row) in data" :key="row">
        <div v-html="line" class="htmlData"></div>
      </div>
    </div>
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
      resultArray: [],
      index: 0,
      headers: [],
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

      let lines = this.renderedMarkdown.split('\n')

      this.resultArray.push([])

      let code = '';
      let inCodeBlock = false

      lines.forEach(line => {

        if (line.includes('h2')) {
          this.resultArray.push([]);
          this.index++;
          this.resultArray[this.index].push(line)
          this.headers.push(line)
        }
        else if (line.includes('pre') || inCodeBlock) {
          if (!inCodeBlock) {
            inCodeBlock = true
            code += line+'\n'
          }
          else if (line.includes('pre') && inCodeBlock) {
            inCodeBlock = false
            code += line

            this.resultArray[this.index].push(code)
            code = ''
          }
          else {
            code += line+'\n'
          }
        }
        else
          this.resultArray[this.index].push(line)

      });

      console.log(this.headers)
    },
  },
};
</script>

<style lang="scss">
  @import 'node_modules/highlight.js/styles/atom-one-dark.css';

  .codeLab{
    max-width: 60%;
    margin: 0 auto;
    font-size: 17px;
  }
  
  .htmlData h2 {
    line-height: 2em;

    font-size: 40px;
  }
</style>
