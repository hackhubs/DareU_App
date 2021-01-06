import AsyncStorage from '@react-native-community/async-storage'

export async function _saveData(key,data) {
    try {
        await AsyncStorage.setItem(key,JSON.stringify(data))
        console.log("saved")    
    } catch (error) {
        console.log(error)
    }
    
    
}

export async function _getData(key) {
    try {
        var value = await AsyncStorage.getItem(key);
        value = value;
        console.log("value returned from storage",value);
        return value;
        
    } catch (error) {
        console.log("storage");
        console.log(error)
    }
}

export async function _clearData(){
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error('Error clearing app data.');
    }
}