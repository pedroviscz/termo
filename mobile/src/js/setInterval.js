export const setIntervalFn = `(function () {

    localStorage.clear();

    let previousValues = {
        duo: localStorage.getItem('duo'),
        termo: localStorage.getItem('termo'),
        quatro: localStorage.getItem('quatro'),
    };

    function sendData(data) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dataUpdate', data }));
    }

    setInterval(() => {
        let changed = false;
        let currentData = {};

        ['duo', 'termo', 'quatro'].forEach(key => {
            const currentValue = localStorage.getItem(key);
            if (currentValue !== previousValues[key]) {
                previousValues[key] = currentValue;
                changed = true;
                try {
                    currentData[key] = JSON.parse(currentValue);
                } catch {
                    currentData[key] = currentValue;
                }
            }
        });

        if (changed) sendData(currentData);
        
    }, 2000);
})();`