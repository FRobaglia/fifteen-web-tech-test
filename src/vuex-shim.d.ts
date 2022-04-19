import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  interface State {
    map: Object
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}