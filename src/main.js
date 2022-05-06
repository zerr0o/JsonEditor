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


//Generic JS constructor
let constants = new Constants();
let fileSystem = new FileSystem();
let genericMethods = new GenericMethods();

//Vue.config.productionTip = false;
Vue.use(VueRouter);

//Vue prototype
Vue.prototype.$genericMethods = genericMethods;
Vue.prototype.$constants = constants;
Vue.prototype.$fileSystem = fileSystem;
Vue.prototype.$ObjectOperation = Vue.observable(new ObjectOperation());

import objectProp from './components/v/ObjectProp.vue';
import arrayProp from './components/v/ArrayProp.vue';
import titleBar from './components/v/TitleBar.vue';
import elementAdder from './components/v/ElementAdder.vue';

Vue.component('object-prop', objectProp);
Vue.component('array-prop', arrayProp);
Vue.component('title-bar', titleBar);
Vue.component('element-adder', elementAdder);


const routes = [
  { path: '/', name:"Home", component: Home },
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







