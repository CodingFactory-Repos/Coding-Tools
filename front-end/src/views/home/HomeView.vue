<template>
	<div class="flex-col" style="--s: 4rem">
		<div class="flex-col">
			<h2 class="text-5xl w-3/4 font-bold">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit.
			</h2>
			<h4 class="text-lg max-w-5xl font-bold">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis porro suscipit quo
				praesentium minima rem saepe quibusdam soluta labore sit quia, aliquid accusantium ipsum
				magnam dignissimos maiores voluptatibus illum corporis.
			</h4>
			<div class="flex-row">
				<RouterLink
					to="/home/signup"
					class="text-white hover:text-white gradiant font-bold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
					>Sign up</RouterLink
				>
				<RouterLink
					to="/home"
					class="text-white bg-gray-400 hover:text-white font-bold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
					>Explore component</RouterLink
				>
			</div>
		</div>
		<div class="flex-col">
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, dolorum. Ex vero quaerat optio
				debitis officia aspernatur eaque tempora dicta nam ipsa. Earum laborum quam iusto, magnam
				suscipit itaque doloribus?
			</p>
		</div>
	</div>
</template>
