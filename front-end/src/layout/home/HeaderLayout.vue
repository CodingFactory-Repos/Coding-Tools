<template>
	<header>
		<nav class="px-4 lg:px-6 py-2.5 dark:bg-gray-800">
			<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
				<RouterLink to="/home" class="flex items-center">
					<img
						src="../../images/CodingToolsFavicon.png"
						class="mr-3 h-6 sm:h-9"
						alt="Flowbite Logo"
					/>
					<span
						class="self-center hidden sm:flex text-xl text-gray-700 font-semibold whitespace-nowrap dark:text-white"
						>Coding Tools</span
					>
				</RouterLink>
				<div class="flex items-center gap-4">
					<RouterLink
						to="/home/signin"
						class="text-gray-700 hover:text-gray-700 bg-white dark:text-white hover:bg-gray-200 font-bold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none"
						>Sign in</RouterLink
					>
					<RouterLink
						to="/home/signup"
						class="text-white hover:text-white gradiant font-bold rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
						>Sign up</RouterLink
					>
				</div>
			</div>
		</nav>
	</header>
</template>
