<template>
	<div class="time">
		<Timer/>
	</div>
</template>

<script>
import Timer from "../components/Timer.vue";

export default {
  name: "TimeView",

  components: {
    Timer
  }
};
</script>

<style>
body {
  background-color: #fff;
}

#time {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>