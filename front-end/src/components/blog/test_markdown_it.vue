<!-- <template>
    <div>
		<input type="file" @change="handleFileChange" accept=".md" />
    </div>
    <div v-html="result"> 
    </div>
    <div class="relative mb-6">
        <input
            type="text"
            id="title"
            class="form-control w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Title"
            v-model="result"
        />
    </div>
</template>

<script lang="ts" setup>
import DOMpurify from 'dompurify'
import MarkdownIt from 'markdown-it';
import highlight from 'highlight.js';
import { computed } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';

const result = ref();

// const file = ref('');

const text = ref('');

const hljs = highlight
const md = new MarkdownIt({
    highlight(code, lang) {
        let highlightedCode = code;

        if(hljs.getLanguage(lang)){
            highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
        }

        return `<pre class='hljs'><code>${highlightedCode}</code></pre>`
    },
})

// const handleFileChange = async (event) => {
// 	let srcFile = event.target.files[0];

//     if (srcFile) {
// 		console.log(srcFile)
//         result.value = await readFile(srcFile).toString();

//         result.value = md.render(result.value)
//     }
// };

const handleFileChange = (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = () => {
			result.value = md.render(reader.result.toString());
		};
		reader.readAsText(file);

	}
};

const readFile = async (file) => {
    return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => resolve(event.target.result);
		reader.onerror = (event) => reject(event);
		reader.readAsText(file);
    });
};

// const resultHtml = computed(() => {
//     if (result) {
//         result.value = md.render(result.toString())
//     }
//     console.log(resultHtml)
// })

// watch(file, (val, source) => {
// 	if (val) {
// 		handleFileChange(val)
// 	}
// })

// watch(result, (val, source) => {
// 	console.log(val, source)
// 	result = md.render(val.toString())
// })

</script>

<style scoped>
    /* @import 'node_modules/highlight.js/styles/atom-one-dark.css'; */
</style> -->