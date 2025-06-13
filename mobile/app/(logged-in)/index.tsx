import React from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { localStorageFn } from '@/src/js/localStorage';
import { createGameRecord, updateGameRecord } from '@/src/services/game';
import { TermoPayload } from '@/src/interfaces/GameData';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';

export default function Termo() {
  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const message: WebViewMessage = JSON.parse(event.nativeEvent.data);
      if (message.title === 'dataUpdate') {
        const gameData = message.data as TermoPayload;
        const modo = Object.keys(gameData)[0] as keyof TermoPayload;
        if (!gameData[modo]) return
        const operacao = gameData[modo].state?.[0]?.curRow === 1
          ? createGameRecord : updateGameRecord;

        const response = await operacao({
          route: modo,
          data: gameData
        });

        if (response) {
          console.log(response)
        } else { throw new Error("Nenhuma reposta da API") }
      } else if (message.title === 'error') console.error('Erro ao monitorar WebView');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.msg || err.message);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else { console.error('Erro desconhecido'); }
    }
  };

  return (
      <WebView
        source={{ uri: 'https://term.ooo' }}
        injectedJavaScriptBeforeContentLoaded={localStorageFn}
        onMessage={handleMessage}
      />
  );
}