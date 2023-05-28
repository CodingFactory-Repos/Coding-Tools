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

  <div>
    <button v-if="step>0" @click="step = step -= 1" class="backBtn py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white ">Back</button>
    <button v-if="step<resultArray.length-1" @click="step=step=step+=1" class="nextBtn text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">Next</button>
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
      step: 0,
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

  // .controls {
  //   position: relative;
  //   bottom: 10%;
  //   display: flex;
  //   justify-content: space-around;
  // }

  // .controls {
  //   position: fixed;
  //     width: 60%;
  //     bottom: 10%;

  //     padding: 10px;
  //     display: flex;
  //     justify-content: space-between;
  // }

  // .controls button {
  //   padding: 5px 10px;
  //   font-size: 14px;
  // }

  .backBtn {
    position: fixed;
    bottom: 10%;
    left: 16%;
  }

  .nextBtn {
    position: fixed;
    bottom: 10%;
    right: 10%;
  }
</style>
