import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import vuetify from '@/plugins/vuetify'

//Vue import
import Home from './components/v/Home.vue';

//JS import
import GenericMethods from './scripts/GenericMethods.js'
import FileSystem from './scripts/FileSystem.js'
import Constants from './data/Constants.js'
import ObjectOperation from './scripts/ObjectOperation.js'
import ObjectProp from "./components/v/ObjectProp";
import ArrayProp from "./components/v/ArrayProp";
import VarProp from "./components/v/VarProp";


//Generic JS constructor
let constants = new Constants();
let fileSystem = new FileSystem();
let genericMethods = new GenericMethods();



Vue.config.productionTip = false;
Vue.use(VueRouter);

//Vue prototype
Vue.prototype.$genericMethods = genericMethods;
Vue.prototype.$constants = constants;
Vue.prototype.$fileSystem = fileSystem;
Vue.prototype.$ObjectOperation = new ObjectOperation();
Vue.prototype.$hovering = "";

// Vue.component('objectProp', require('./components/v/ObjectProp.vue'));
// Vue.component('arrayProp', require('./components/v/ArrayProp.vue'));
// Vue.component('varProp', require('./components/v/VarProp.vue'));


const routes = [
  { path: '/', name:"Home", component: Home },
  { path: '/ObjectProp', name:"objectProp", component: ObjectProp },
  { path: '/ArrayProp', name:"arrayProp", component: ArrayProp },
  { path: '/VarProp', name:"varProp", component: VarProp }
]

const router = new VueRouter({routes});

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app');


// //If you need to load data before mounting the dom
// fileSystem.load(constants.PATH_DATA_TO_LOAD,(data)=> {
//   Vue.prototype.$dataToLoad = data;
//   new Vue({
//     vuetify,
//     router,
//     render: h => h(App),
//   }).$mount('#app');
// });







