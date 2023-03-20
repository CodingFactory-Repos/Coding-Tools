<template>
	<div class="flex w-full h-full absolute pointer-events-none">
		<div class="p-3 w-full h-full relative flex flex-col justify-between gap-10">
			<div class="w-full h-12 flex gap-10 justify-between">
				<slot name="top"/>
			</div>
			<div class="w-full grow flex justify-between gap-10">
				<div class="w-fit flex flex-col gap-10">
					<slot name="left"/>
				</div>
				<div class="w-fit flex flex-col gap-10">
					<slot name="right"/>
				</div>
			</div>
			<div class="w-full h-12 flex gap-10 justify-between">
				<slot name="bottom"/>
			</div>
		</div>
		<div class="h-full flex" style="max-width: 250px">
			<slot name="drawer-right"/>
		</div>
	</div>
</template>