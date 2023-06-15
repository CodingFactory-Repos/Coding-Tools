<!-- eslint-disable vue/no-v-html -->
<template>
	<ModalOverlay v-if="showCommentModal" @close="closeCommentModal" size="2xl">
		<template #body>
			<AddComment />
		</template>
	</ModalOverlay>

	<div class="relative">
		<div class="codeLab text-gray-900 dark:text-white">
			<div
				v-if="formatedArray.length > 0"
				class="mb-2 tracking-tight text-gray-900 dark:text-white"
			>
				<!-- STICKY BAR -->
				<div
					v-if="props.preview === false"
					tabindex="-1"
					class="relative top-0 left-0 z-0 flex justify-between w-full p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 block"
				>
					<div class="flex items-center mx-auto">
						<button
							type="button"
							@click="
								() => {
									$router.push('/app/blog');
								}
							"
							class="mr-20 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							<svg
								fill="none"
								class="w-4 h-4 mr-2 -ml-1"
								stroke="white"
								stroke-width="1.5"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
								/>
							</svg>
							Tous les articles
						</button>
						<h1 class="flex items-center text-4xl font-normal text-gray-500 dark:text-gray-400">
							{{ title }}
						</h1>
						<button
							v-if="windowWidth <= 1024"
							@click.prevent="toggle()"
							type="button"
							class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						>
							<span class="sr-only">Open sidebar</span>

							<svg
								class="w-6 h-6"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									clip-rule="evenodd"
									fill-rule="evenodd"
									d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- CONTENT HERE -->

				<div class="flex flex-row">
					<div
						:class="
							windowWidth >= 1024
								? 'flex flex-col items-center w-4/5 relative '
								: 'flex flex-col items-center w-5/5'
						"
					>
						<div v-if="props.preview === false">
							<div
								v-if="step === 0"
								class="mt-12 block max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
							>
								<h2>{{ description }}</h2>
								<p>Publié le : {{ formatDate(date) }}</p>
								<p>Par : {{ user }}</p>
							</div>
						</div>

						<div
							class="block max-w-xl p-6 mt-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
						>
							<div v-for="(data, index) in formatedArray[step]" :key="index">
								<div v-for="(line, row) in data" :key="row">
									<div v-html="line" class="htmlData"></div>
								</div>
							</div>
						</div>

						<div class="content">
							<button
								v-if="step > 0"
								@click="step = step -= 1"
								class="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white"
							>
								Back
							</button>
							<button
								v-else
								class="scale-0 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white"
							>
								Back
							</button>
							<button
								v-if="step < formatedArray.length - 1"
								@click="step = step = step += 1"
								class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
							>
								Next
							</button>
						</div>
					</div>

					<div class="w-1/5" v-if="windowWidth >= 1024">
						<div class="h-auto px-3 py-4 overflow-y-auto transition-transform">
							<ul class="text-sm">
								<li v-for="(item, index) in headers" :key="index">
									<a
										@click.prevent="setStep(index)"
										:class="{
											'block text-black hover:text-black bg-gray-100 dark:bg-transparent dark:border-gray-500':
												step >= index,
											'shadow-md font-bold hover:text-black dark:shadow-gray-600': step == index,
											'block text-gray-400 hover:text-gray-400 hover:bg-transparent dark:text-white dark:border-gray-700 dark:hover:bg-transparent':
												step < index,
										}"
										class="flex flex-row items-center cursor-pointer p-2 mb-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
									>
										<div class="ml-3">
											<h2
												:class="{
													'font-bold': step == index,
													'bg-gray-400': step < index,
												}"
												class="inline-block leading-8 w-8 h-8 bg-blue-600 text-white text-center rounded-full"
											>
												{{ index + 1 }}
											</h2>
										</div>
										<span class="ml-3"> {{ item }}</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- SIDEBAR -->
		<aside
			v-if="open && windowWidth <= 1024"
			x-show="open"
			x-transition:enter="transition duration-300 ease-in-out transform"
			x-transition:enter-start="translate-x-full"
			x-transition:enter-end="translate-x-0"
			x-transition:leave="transition duration-300 ease-in-out transform"
			x-transition:leave-start="translate-x-0"
			x-transition:leave-end="translate-x-full"
			@keydown.escape="windowWidth <= 1024 ? (open = false) : ''"
			class="absolute inset-y-0 top-0 right-0 z-10 flex-shrink-0 bg-white xl:z-0 xl:sticky w-80 dark:bg-darker dark:text-light xl:border-l dark:border-indigo-800 focus:outline-none"
		>
			<div
				class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 transition-transform"
			>
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
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<ul class="space-y-2 font-medium">
					<li v-for="(item, index) in headers" :key="index">
						<a
							@click.prevent="setStep(index)"
							:class="
								step == index
									? 'light:bg-gray-100 dark:bg-gray-700 block py-2 pl-3 pr-4 dark:text-white bg-blue-700 rounded bg-transparent text-blue-700 p-0 dark:text-blue-500'
									: 'block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent  p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent dark:border-gray-700'
							"
							class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<h2 class="ml-3">{{ index + 1 }}. {{ item }}</h2>
						</a>
					</li>
				</ul>
			</div>
		</aside>
	</div>

	<div v-if="props.preview === false">
		<hr class="my-5" />

		<div v-if="!props.markdown" class="text-center w-full">
			<button
				type="button"
				@click="openCommentModal"
				class="text-blue-700 m-auto flex flex-row items-center hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
			>
				<Add class="!fill-blue-600" />
				<span class="ml-2"> Ajouter un commentaire </span>
			</button>
		</div>
		<div>
			<article v-for="comment in oneItems.comments" :key="comment.title" class="p-5">
				<header class="mb-2">
					<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
						{{ comment.title }}
					</h3>
				</header>
				<div class="flex items-center mb-4 space-x-4">
					<img
						class="w-10 h-10 rounded-full"
						:src="
							comment.picture
								? comment.picture
								: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
						"
						alt=""
					/>
					<div class="font-medium dark:text-white">
						<p class="text-gray-900 dark:text-white">
							{{ comment.firstName }} {{ comment.lastName }}
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">{{ comment.email }}</p>
					</div>
				</div>
				<footer class="mb-5 text-sm text-gray-500 dark:text-gray-400">
					<p>Écrit le {{ formatDate(comment.date) }}</p>
				</footer>

				<p class="mb-2 font-light text-gray-500 dark:text-gray-400">
					{{ comment.descriptions }}
				</p>
			</article>
		</div>
	</div>
</template>

<script lang="ts" setup>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useArticleStore } from '@/store/modules/article.store';
import Add from '../common/svg/Add.vue';
import AddComment from '@/components/blog/AddComment.vue';
import ModalOverlay from '@/components/common/Modal.vue';
import MarkdownItClass from '@toycode/markdown-it-class';
import { useMaterialStore } from '@/store/modules/material.store';

const props = defineProps({
	markdown: {
		type: String,
		required: false,
	},
	preview: {
		type: Boolean,
		default: false,
	},
});

// get store
const articleStore = useArticleStore();
const oneItems = computed(() => articleStore.oneItems);

// get user by Id
const materialStore = useMaterialStore();

const showCommentModal = ref(false);
const openCommentModal = () => (showCommentModal.value = true);
const closeCommentModal = () => (showCommentModal.value = false);
const formatDate = (date: Date) => {
	// transform date to string
	const newDate = date.toString();
	const dateSplited = newDate.split('T')[0].split('-').reverse().join('/');
	const timeSplited = newDate.split('T')[1].split('.')[0];
	return `${dateSplited} à ${timeSplited}`;
};

const windowWidth = ref(window.innerWidth);
onMounted(() => {
	window.addEventListener('resize', () => {
		windowWidth.value = window.innerWidth;
	});
});

if (!props.markdown) {
	// get id from url
	const _id = computed(() => {
		const url = window.location.href;
		const id = url.substring(url.lastIndexOf('/') + 1);
		return id;
	});

	// get article by id
	const getArticleById = async (_id: string) => {
		await articleStore.getArticleById(_id);
	};

	// get article by id on mounted
	onMounted(async () => {
		await getArticleById(_id.value);
		srcMarkdown.value = oneItems.value.content;
		date.value = oneItems.value.date;
		title.value = oneItems.value.title;
		description.value = oneItems.value.descriptions;
		let tempUser = await materialStore.getUserById(oneItems.value.owner._id);

		// format for captital letters
		user.value =
			tempUser.profile.firstName.charAt(0).toUpperCase() +
			tempUser.profile.firstName.slice(1) +
			' ' +
			tempUser.profile.lastName.charAt(0).toUpperCase() +
			tempUser.profile.lastName.slice(1);

		renderMarkdown();
	});
}

const formatDateField = (date) => {
	// transform date to string
	let tempDate;

	date = date.split(' ');

	tempDate = date[2] + ' ' + date[1] + ' ' + date[3];

	return tempDate;
};

const step = ref(0);
const title = ref('Your title here');
const date = ref('The date it was uploaded');
const description = ref('Your description here');
const user = ref('Vous');

// visuals
const open = ref(false);

// infos displayed
const formatedArray = ref([[]]);

// for md render
const srcMarkdown = ref();
const renderedMarkdown = ref();
const indexArray = ref(0);
const headers = ref([]);
const firstSection = ref(true);

watch(
	() => props.markdown,
	(newVal) => {
		srcMarkdown.value = newVal;

		renderMarkdown();
	},
);

const renderMarkdown = () => {
	const md = new MarkdownIt({
		highlight(code, lang) {
			let highlightedCode = code;

			if (hljs.getLanguage(lang)) {
				highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
			}

			return `<pre class='hljs overflow-x-scroll'><div class='p-2'><span class='flex justify-end italic'>${lang}</span><code class="${lang}">${highlightedCode}</code></div></pre>`;
		},
	});

	md.use(MarkdownItClass, {
		h1: 'text-4xl mt-5 mb-2 border-b border-gray-300 font-bold text-gray-900 dark:text-white',
		h2: 'text-3xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h3: 'text-2xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h4: 'text-xl mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h5: 'text-lg mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		h6: 'text-base mt-5 mb-2  font-bold text-gray-900 dark:text-white',
		img: 'max-w-[25rem] m-auto h-auto mt-7 mb-7',
		p: 'text-gray-900 mt-2 mb-2 dark:text-white',
	});

	renderedMarkdown.value = md.render(srcMarkdown.value);

	let lines = renderedMarkdown.value.split('\n');

	formatedArray.value = [[]];

	let code = '';
	let inCodeBlock = false;
	firstSection.value = true;
	indexArray.value = 0;
	headers.value = [];

	lines.forEach((line) => {
		if (line.startsWith('<h1>')) {
			formatedArray.value[indexArray.value].push({ value: line });
		} else if (line.startsWith('<h2')) {
			if (firstSection.value) {
				firstSection.value = false;
				formatedArray.value[indexArray.value].push({ value: line });
				headers.value.push(getSubstring(line, '>', '<'));
			} else {
				formatedArray.value.push([]);
				indexArray.value++;
				formatedArray.value[indexArray.value].push({ value: line });
				headers.value.push(getSubstring(line, '>', '<'));
			}
		} else if (line.includes("<pre class='hljs overflow-x-scroll'>") || inCodeBlock) {
			if (!inCodeBlock) {
				inCodeBlock = true;
				code += line + '\n';
			} else if (line.includes('</pre>')) {
				inCodeBlock = false;
				code += line;

				formatedArray.value[indexArray.value].push({ value: code });
				code = '';
			} else {
				code += line + '\n';
			}
		} else {
			formatedArray.value[indexArray.value].push({ value: line });
		}
	});
};

const getSubstring = (str, start, end) => {
	let char1 = str.indexOf(start) + 1;
	let char2 = str.lastIndexOf(end);

	return str.substring(char1, char2);
};

const toggle = () => {
	open.value = !open.value;
};

const setStep = (i) => {
	step.value = i;
};
</script>

<style lang="scss">
.codeLab {
	margin: 0 auto;
	font-size: 17px;
}

.content {
	position: absolute;
	bottom: 0;
	width: 80%;
	display: flex;
	justify-content: space-between;
}
/*
.backBtn {
	position: absolute;
	bottom: 5%;
	left: 10%;
}

.nextBtn {
	position: absolute;
	bottom: 5%;
	right: 30%;
}
*/
.selected {
	border: 3px grey;
}

pre code.hljs {
	display: block !important;
	overflow-x: auto !important;
	padding: 1em !important;
}

code.hljs {
	padding: 3px 5px !important;
}

.hljs {
	color: #abb2bf !important;
	background: #282c34 !important;
}

.hljs-comment,
.hljs-quote {
	color: #5c6370 !important;
	font-style: italic !important;
}

.hljs-doctag,
.hljs-formula,
.hljs-keyword {
	color: #c678dd !important;
}

.hljs-deletion,
.hljs-name,
.hljs-section,
.hljs-selector-tag,
.hljs-subst {
	color: #e06c75 !important;
}

.hljs-literal {
	color: #56b6c2 !important;
}

.hljs-addition,
.hljs-attribute,
.hljs-meta .hljs-string,
.hljs-regexp,
.hljs-string {
	color: #98c379 !important;
}

.hljs-attr,
.hljs-number,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-pseudo,
.hljs-template-variable,
.hljs-type,
.hljs-variable {
	color: #d19a66 !important;
}

.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-symbol,
.hljs-title {
	color: #61aeee !important;
}

.hljs-builtin,
.hljs-class .hljs-title,
.hljs-title.class {
	color: #e6c07b !important;
}

.hljs-emphasis {
	font-style: italic !important;
}

.hljs-strong {
	font-weight: 700 !important;
}

.hljs-link {
	text-decoration: underline !important;
}
</style>
