<template>
   <div class="flex flex-col items-center mt-10">

	<div v-if="getGroup" class="relative w-full md:w-9/12">
		<table class="text-center w-full">
			<caption hidden>
				Group
			</caption>
			<thead class="border-b-[6px] h-14 dark:border-[#1f2028] border-[#f3f4f6]">
				<tr>
					<th scope="col" >#</th>
					<th scope="col">Prénom & Nom</th>
				</tr>
			</thead>
			<tbody>
				<tr
					class="dark:hover:bg-[#43494e] h-12 dark:bg-[#343a40] hover:bg-[#91919128] bg-[#ffff]"
					v-for="(member, index) in groupList"
					:key="member.id"
				>
					<th scope="col">{{ index + 1 }}</th>
					<td>
						<p :class="'text-white'">
							{{ member.profile.firstName }} {{ member.profile.lastName }}
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
		
		<div v-else>
			<p class="dark:text-white text-[#5c5f73]">{{ message }}</p>
		</div>

	</div>
</template>

<script lang='ts'>
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let courseId = '';
let message = '';
let groupList = [];

export default {
	name: 'Component',
	data() {
		return {
			courseId,
			message,
			groupList,
		};
	},
	mounted() {
		this.getCourseId();
		this.getGroup();
	},
	methods: {
		getCourseId: withErrorHandler(async function () {
			http.get(`/spnts/actual_course/`).then((response) => {
				this.courseId = response.data.actualCourse;
				this.isThereCourse();
			});
		}),

		getGroup: withErrorHandler(async function () {
			http.get(`/groups/${this.courseId}/${this.groupId}`).then((response) => {
				this.groupList = response.data.array; 
			});
    	}),

		isThereCourse() {
			if (this.courseId) {
				this.message = '';
			} else {
				this.message = "Vous n'avez pas de cours aujourd'hui";
			}
		},
	},
};

</script>