const actions = {
    'hello-there' () {
        console.log('saying hello');
    },

    hello () {
        console.log('saying hello');
    },

    randInt (min = 0, max = 100) {
        min = Number(min);
        max = Number(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    longProc () {
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve(actions.randInt(0, 100));
            }, 5000);
        });
    },

    randProc () {
        const timeout = actions.randInt(0, 7) * 1000;
        return new Promise((resolve) => {
            setTimeout(() => {
                return resolve(actions.randInt(0, 100));
            }, timeout);
        });
    }
};
