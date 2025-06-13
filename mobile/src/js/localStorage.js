export const localStorageFn = `
(function () {
  localStorage.clear();
  try {
    let debounceTimer;
    const originalSetItem = localStorage.setItem;
    const latestValues = {};

    function sendDataToReactNative(data) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ title: 'dataUpdate', data })
      );
    }

    function scheduleSend(data) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        sendDataToReactNative(data);
      }, 100); // Delay de 100ms
    }

    localStorage.setItem = function (key, value) {
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }

      latestValues[key] = parsedValue;
      scheduleSend({ [key]: parsedValue });

      return originalSetItem.apply(this, arguments);
    };
  } catch (e) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        title: 'error',
        error: 'Erro ao iniciar monitoramento: ' + e.message,
      })
    );
  }
})();
`;