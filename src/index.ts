// import Vue from "vue";
import { Vue } from "vue-property-decorator";
import App from "./view/App.vue";

// import Router from "vue-router";

// Vue.use(Router);

// const router = new Router({
//   routes: [{ path: "/", component: App }]
// });

new Vue({
  components: { App }
  // router: router
}).$mount("#app");
