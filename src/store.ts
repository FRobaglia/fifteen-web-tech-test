import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      map: undefined
    }
  },
  mutations: {
    loadMap(state: any, map) {
        state.map = map
    }
  }
})