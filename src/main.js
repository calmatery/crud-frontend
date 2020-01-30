import Vue from 'vue';
// import { Button,Layout } from 'ant-design-vue';
import App from './App';

// Vue.component(Button.name, Button);
// Vue.component(Layout.name, Layout);
// Vue.component(Layout.Header.name, Layout.Header);
// Vue.component(Layout.Content.name, Layout.Content);
// Vue.component(Layout.Sider.name, Layout.Sider);
// Vue.component(Layout.Footer.name, Layout.Footer);

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
