const worker = `
    onmessage = async function (e) {
        const data = e.data;

        postMessage({
            type: 'status',
            status: 'processing...'
        });

        switch (data.cmd) {
            case 'ping':
                postMessage({
                    type: 'status',
                    status: 'ready'
                });

                break;
            default:
                if (!actions.hasOwnProperty(data.cmd)) {
                    postMessage({
                        type: 'err',
                        msg: 'Command not found'
                    });

                    break;
                }

                const result = await actions[data.cmd](...data.args);

                postMessage({
                    type: 'result',
                    result: result
                });

                break;
        }
    };
`;

export default worker;
