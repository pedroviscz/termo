import AsyncStorage from "@react-native-async-storage/async-storage";

const clear = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage limpo com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar AsyncStorage:', error);
  }
};

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('AsyncStorage limpo com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar AsyncStorage:', error);
  }
};

export {
  clear,
  removeItem
}