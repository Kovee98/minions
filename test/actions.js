const actions = {
    sync (worker) {
        const baseUrl = 'http://localhost:5984';
        const db = `worker-${worker.id}`;
        const url = `${baseUrl}/${db}/_changes?feed=continuous&heartbeat=10000`;

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=');

        xhr.onprogress = () => {
            // const res = JSON.parse(xhr.response);
            // console.log('progress:', res);
            console.log(`change in worker-${worker.id}`);
            worker.post(`change in worker-${worker.id}`);
        };

        xhr.onload = () => {
            // const res = JSON.parse(xhr.response);
            // console.log('done:', res);
            console.log(`done with worker-${worker.id}`);
            worker.post(`done with worker-${worker.id}`);
        };

        xhr.send();
    },

    churn (worker, count = 1, isDeletion = false, docId, doc = {}) {
        // base case
        if (count <= 0) return 'Done!';

        const baseUrl = 'http://localhost:5984';
        const db = `worker-${worker.id}`;
        docId = docId || `doc-${actions.randInt(0, 100000)}`;
        const url = `${baseUrl}/${db}/${docId}`;

        doc.msg = 'hey there';
        doc.time = Date.now();
        doc.iter = count;

        if (!isDeletion) {
            delete doc._rev;
            doc._deleted = false;
        } else {
            doc._deleted = true;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=');

        xhr.onload = () => {
            const res = JSON.parse(xhr.response);
            const resDoc = {
                _rev: res.rev
            };

            // console.log('res:', res);
            return actions.churn(worker, count - 1, !isDeletion, docId, resDoc);
        };

        xhr.send(JSON.stringify(doc));
    },

    createDB ({ id }) {
        const baseUrl = 'http://localhost:5984';
        const db = `worker-${id}`;
        const url = `${baseUrl}/${db}`;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, false);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=');

        xhr.onload = () => {
            const res = JSON.parse(xhr.response);
            console.log(res);
            return res;
        };

        xhr.send();
    },

    removeDB ({ id }) {
        const baseUrl = 'http://localhost:5984';
        const db = `worker-${id}`;
        const url = `${baseUrl}/${db}`;

        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url, false);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=');

        xhr.onload = () => {
            const res = JSON.parse(xhr.response);
            console.log(res);
            return res;
        };

        xhr.send();
    },

    revsLimit ({ id }, revsLimit) {
        const baseUrl = 'http://localhost:5984';
        const db = `worker-${id}`;
        const url = `${baseUrl}/${db}/_revs_limit`;

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, false);

        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic YWRtaW46cGFzc3dvcmQ=');

        xhr.onload = () => {
            const res = JSON.parse(xhr.response);
            console.log(res);
            return res;
        };

        xhr.send(revsLimit);
    },

    printId ({ id }) {
        console.log(id);
        return id;
    },

    'hello-there' () {
        console.log('saying hello');
    },

    hello () {
        console.log('saying hello');
    },

    randInt (_, min = 0, max = 100) {
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
