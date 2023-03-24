import { defineStore } from "pinia";
import { OpenHouseStore  } from '@/store/interfaces/openHouse.interface';

export const useOpenHouseStore = defineStore('openHouse', {
	state: (): OpenHouseStore => {
		return {}
    }
})