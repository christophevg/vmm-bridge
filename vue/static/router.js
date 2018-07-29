var routes = [
  { path: '/', component: Home },
];

var router = new VueRouter({
  routes: routes,
  mode  : 'history'
});

var app = new Vue({
  el: "#app",
  delimiters: ['${', '}'],
  router: router,
  components: {},
  data: {
    drawer: null,
    sections: [
      { icon: "home", text: "Home", path: "/" },
    ]
  },
  methods: {
    // VFG background colors clash
    fixVuetifyCSS : function() {
      this.$vuetify.theme.info  = '#ffffff';
      this.$vuetify.theme.error = '#ffffff';
    }
  }
}).$mount('#app');

app.fixVuetifyCSS();
