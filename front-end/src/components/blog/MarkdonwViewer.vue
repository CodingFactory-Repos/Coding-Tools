<template>

  <div class="codeLab text-gray-900 dark:text-white">
    <input type="file" accept=".md" @change="handleFileChange" />


    <!-- <div v-if="fileContent !== ''" v-html="renderedMarkdown"></div> -->
    <div v-if="resultArray.length>0" class=" mb-2 tracking-tight text-gray-900 dark:text-white">

		<!-- STICKY BAR -->
		<div tabindex="-1" class="fixed top-0 left-0 z-0 flex justify-between w-full p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 block">
				<div class="flex items-center mx-auto">
					<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
						<h2>{{ title }}</h2>
				</p>
				<button 
					@click.prevent="toggle()" type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
					<span class="sr-only">Open sidebar</span>

					<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
					</svg>
				</button>


			</div>
		</div>

		<!-- CONTENT HERE -->
		<div class="flex flex-col items-center">
			<div v-if="step===0" class="mt-12 block max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">				
				<h2>About this coding tutorial</h2>
				<div>Last updated : </div>
				<div>Redacted by : </div>
			</div>

			<div class="block max-w-xl p-6 mt-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">				
				<div v-for="(data, index) in resultArray[step]" :key="index">
					<div v-for="(line, row) in data" :key="row">
						<div v-html="line" class="htmlData"></div>
					</div>
				</div>
			</div>
		</div>
		
    </div>
  </div>


					<!-- SIDEBAR -->
					<aside v-if="open"         x-show="open"
        x-transition:enter="transition duration-300 ease-in-out transform"
        x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0"
        x-transition:leave="transition duration-300 ease-in-out transform"
        x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        @keydown.escape="window.innerWidth <= 1024 ? open = false : ''"

         class="fixed inset-y-0 top-0 right-0 z-10 flex-shrink-0 bg-white xl:z-0 xl:sticky w-80 dark:bg-darker dark:text-light xl:border-l dark:border-indigo-800 focus:outline-none">
					<div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 transition-transform">
						<div class="absolute right-0 p-1 transform -translate-x-full">
							<button
								@click.prevent="toggle()"
								class="p-2 rounded-md text-dark dark:text-light focus:outline-none focus:ring"
							>
								<svg
									class="w-5 h-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<ul class="space-y-2 font-medium">
							<li v-for="(item, index) in headers" :key="index">
								<a @click.prevent="setStep(index)" :class="step == index ? 'light:bg-gray-100 dark:bg-gray-700 block py-2 pl-3 pr-4 text-white bg-blue-700 rounded bg-transparent text-blue-700 p-0 dark:text-blue-500' : 'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent hover:text-blue-700 p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent dark:border-gray-700'" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
									<h2 class="ml-3">{{ index+1 }}. {{ item }}</h2>
								</a>
							</li> 
						</ul>
					</div>
				</aside>


  <div>
    <button v-if="step>0" @click="step = step -= 1" class="backBtn py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white ">Back</button>
    <button v-if="step<resultArray.length-2" @click="step=step=step+=1" class="nextBtn text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none">Next</button>
  </div>
  
</template>

<script>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export default {
  name: 'MarkdownViewer',
  setup(){
	// watchScreen() {
    //         if (window.innerWidth <= 768) {
    //             this.isUserPanelOpen = false
    //         } else if (window.innerWidth >= 768 && window.innerWidth < 1280) {
    //             this.isUserPanelOpen = false
    //         } else if (window.innerWidth >= 1280) {
    //             this.isUserPanelOpen = true
    //         }
    //     },

  },
  data() {
    return {
	isUserPanelOpen: false,
		open: false,
		fileContent: '',
		renderedMarkdown: '',
		resultArray: [],
		index: 0,
		headers: [],
		step: 0,
		title: '',
		right: true,
		firstSection: true,
    };
  },
  methods: {
    toggle() {
		console.log(this.resultArray)
			this.open = !this.open;
		},
	setStep (i) {
		console.log(i)
		this.step = i;
	},
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
    getSubstring(str, start, end) {
      let char1 = str.indexOf(start) + 1
      let char2 = str.lastIndexOf(end)
      return str.substring(char1, char2)
    },
    renderMarkdown() {
      const md = new MarkdownIt({
        highlight(code, lang) {
        let highlightedCode = code;

        if(hljs.getLanguage(lang)){
            highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        }

        return `<pre class='hljs overflow-x-scroll'><code class="">${highlightedCode}</code></pre>`
    },
      });

      this.renderedMarkdown = md.render(this.fileContent);

      let lines = this.renderedMarkdown.split('\n')

      this.resultArray.push([])

      let code = '';
      let inCodeBlock = false

      lines.forEach(line => {

        if (line.startsWith('<h1>')) {
          this.title = this.getSubstring(line, '>', '<')
          this.resultArray[this.index].push({value: line})
        }
        else if (line.startsWith('<h2>')) {
			if (this.firstSection) {
				this.firstSection = false
				this.resultArray[this.index].push({value: line})
				this.headers.push(this.getSubstring(line, '>', '<'))
			}
			else {
				this.resultArray.push([]);
				this.index++;
				this.resultArray[this.index].push({value: line})
				this.headers.push(this.getSubstring(line, '>', '<'))
			}
        }
        else if (line.startsWith('<pre>') || inCodeBlock) {
          if (!inCodeBlock) {
            inCodeBlock = true
            code += line+'\n'
          }
          else if (line.startsWith('<pre>') && inCodeBlock) {
            inCodeBlock = false
            code += line

            this.resultArray[this.index].push({value: code})
            code = ''
          }
          else {
            code += line+'\n'
          }
        }
        else
          this.resultArray[this.index].push({value: line})

      });

      // console.log(this.headers)
    },
	openUserPanel() {
            this.isUserPanelOpen = true
            this.$nextTick(() => {
                this.$refs.userPanel.focus()
            })
        },
  },
};
</script>

<style lang="scss">
  @import 'node_modules/highlight.js/styles/atom-one-dark.css';

//   .codeLab{
//     max-width: 60%;
//     margin: 0 auto;
//     font-size: 17px;
//   }
  
  .htmlData h2 {
    line-height: 2em;

    font-size: 20px;
  }

  .backBtn {
    position: fixed;
    bottom: 5%;
    left: 16%;
  }

  .nextBtn {
    position: fixed;
    bottom: 5%;
    right: 10%;
  }

  .selected {
	border: 3px grey;
  }
</style>
