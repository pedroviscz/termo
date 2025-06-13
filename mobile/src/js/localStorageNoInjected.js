(function () {
    localStorage.clear();
    try {
        const originalSetItem = localStorage.setItem;

        function sendDataToReactNative(data) {
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'dataUpdate', data })
            );
        }

        localStorage.setItem = function (key, value) {
            const previousValue = localStorage.getItem(key);
            if (previousValue !== value) {
                try { parsedValue = JSON.parse(value); }
                catch { parsedValue = value; }
                sendDataToReactNative({ [key]: parsedValue });
            }
            return originalSetItem.apply(this, arguments);
        };

    } catch (e) {
        window.ReactNativeWebView.postMessage(
            JSON.stringify({
                type: 'error',
                error: 'Erro ao iniciar monitoramento: ' + e.message,
            })
        );
    }
})();