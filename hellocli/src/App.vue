<template>
  <Movie v-for="movie in movies" :key="movie.id" :title = "movie.title" :rating = "movie.rating"/>
</template>

<script>
import Movie  from "./components/Movie.vue";

export default {
  name: 'App',
  computed: {
  },
  data:function () {
    return {
      movies: [
        { id:1, title: 'Movie 1', rating:8.8 },
        { id:2, title: 'Movie 2', rating:8.9 },
        { id:3, title: 'Movie 3', rating:8.7 }
      ]
    }
  },
  components: {
    Movie
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
