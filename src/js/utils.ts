const utils = {
    camelizeStr (str: String) {
        return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function(_, p1, p2) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    },

    camelizeActions (actions: Record<string, any>) {
        const newActions: Record<string, any> = {};

        for (let key in actions) {
            const camelKey = utils.camelizeStr(key);
            if (actions.hasOwnProperty(key)) {
                newActions[camelKey] = actions[key];
            }
        }

        return newActions;
    },

    bytes: (bytes: number, decimals = 1) => {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    clamp: (num: number, min: number, max: number) => {
        return Math.min(Math.max(num, min), max);
    }
};

export default utils;
