import { PersistentStore, ActionsFile } from "../types/index";

interface AppData extends Object {
    count: number,
    actionsFile: ActionsFile
}

class GeneralStore extends PersistentStore<Object> {
    protected data(): AppData {
        return {
            count: 0,
            actionsFile: {
                name: '',
                size: 0,
                content: ''
            }
        };
    }

    get count () {
        return this.state.count;
    }

    set count (count: number) {
        this.state.count = count;
    }

    get actionsFile () {
        return this.state.actionsFile;
    }

    set actionsFile (actionsFile: ActionsFile) {
        this.state.actionsFile = actionsFile;
    }

    clearActions () {
        this.state.actionsFile = {
            name: '',
            size: 0,
            content: ''
        };
    }
}

export const generalStore = new GeneralStore('minions_general_store');