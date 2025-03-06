import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCounterStore = defineStore('counter', () => {
    const app_name = ref('Web3 App Test')

        return { app_name  }
    })
