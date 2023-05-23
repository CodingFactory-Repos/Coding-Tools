<template>
  <div>
    <input type="file" @change="handleFileChange" accept=".md" />
    <div v-if="jsonData">
      <h2>Summary</h2>
      <ul>
        <li v-for="(title, index) in jsonData.summary" :key="index">{{ title }}</li>
      </ul>
      <!-- <pre>{{ jsonData.data }}</pre> -->
    </div>
  </div>
</template>

<style scoped>
.margin {
	width: fit-content;
}
</style>

<script>
import { ref } from 'vue';

export default {
  name: 'MarkdownParser',
  setup() {
    const jsonData = ref(null);

    const handleFileChange = async (event) => {
      const file = event.target.files[0];

      if (file) {
        const data = await readFile(file);
        const parsedData = parseMarkdown(data);
        jsonData.value = parsedData;
      }
    };

    const readFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (event) => reject(event);
        reader.readAsText(file);
      });
    };

    const parseMarkdown = (data) => {
      const lines = data.split('\n');
      const summary = [];
      const jsonData = { title: '', summary: [] , data: [], totalDuration: 0 };
      let currentSection = null;
      let currentContentLi = { type: 'list', values: []};
      let currentContentCode = { type: 'code', lang: '', values: []}
      let inCodeContent = false
      let i = -1

      lines.forEach((line) => {

        if (line == "") {
          return
        }

        else if (line.startsWith('<!-- ------------------------ -->')){
          jsonData.data.push([])
          i++;
        }
        else if (line.startsWith('###')) {
          jsonData.data[i].push({ type: "title", value: line.substring(line.indexOf(" ") + 1)})
        }
        else if (line.startsWith('##')) {
          jsonData.summary.push(line.substring(line.indexOf(" ") + 1))
        }
        else if (line.startsWith('#')) {
          jsonData.title = line.substring(line.indexOf(" ") + 1);
        }

        else if (line.startsWith('Duration')) {
          let num = parseInt(line.substring(line.indexOf(" ") + 1), 10)
          if(isNaN(num)){
            return
          }
          
          jsonData.totalDuration = jsonData.totalDuration + num
          jsonData.data[i].push({ type: "duration", value: num })
        }

        else if (!line.startsWith('- ') && currentContentLi.values.length>0) {
          jsonData.data[i].push(currentContentLi)

          currentContentLi = { type: 'list', values: [] };
        }

        else if (line.startsWith('- ')) {
          currentContentLi.values.push(line.substring(2).trim())
        }

        else if (line.startsWith('```')) {
          if (!inCodeContent) {
            inCodeContent = true
            currentContentCode.lang = line.substring(3)

            return
          }
          else {
            inCodeContent = false
            jsonData.data[i].push(currentContentCode)

            currentContentCode = { type: 'code', lang: '', values: []}
          }
        }

        else if (inCodeContent) {
          currentContentCode.values.push(line)
        }



        else {
          jsonData.data[i].push({ type: "text", value: line})
        }
      });

      if (currentSection) {
        currentSection.content.push(currentContent);
      }

      console.log(jsonData)
      return jsonData;
    };

    return {
      jsonData,
      handleFileChange
    };
  }
};
</script>
