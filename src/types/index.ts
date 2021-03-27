import { reactive, readonly, watch, ref } from 'vue';
import { set, get } from 'idb-keyval';

export interface Minion {
    id: number,
    worker: Worker|null
}

export interface MinionList {
    count: number,
    minions: Array<Minion>
}

export interface ActionsFile {
    name: string,
    size: number,
    content: string
}

export abstract class Store<T extends Object> {
    protected state: T;

    constructor (readonly storeName: string) {
        const data = this.data();
        this.state = reactive(data) as T;
    }

    protected abstract data(): T

    public getState (): T {
        return readonly(this.state) as T;
    }
}

export abstract class PersistentStore<T extends Object> extends Store<T> {
    private isInit = ref(false);

    constructor(readonly storeName: string) {
        super(storeName);
    }

    async init() {
        if(this.isInit) {
            let idbState: string = await get(this.storeName);

            if(idbState) {
                Object.assign(this.state, JSON.parse(idbState));
            }

            watch(() => this.state, (val) => set(this.storeName, JSON.stringify(val)), {deep: true});

            this.isInit.value = true;
        }
    }

    isInitialized (): boolean {
        return this.isInit.value;
    }
}