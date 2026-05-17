import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  // 確保導航函數存在，避免底層型別判斷錯誤
  const handlePress = () => {
    if (navigation) {
      navigation.navigate('FullRoute');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Global Route Master</Text>
        <Text style={styles.tagline}>1919 愛走動 · 數位路書系統</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.statusText}>✅ 系統連線正常</Text>
        <Text style={styles.infoText}>1,300 公里全程數據已就緒</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handlePress}
        >
          <Text style={styles.btnText}>🗺️ 進入全程概覽</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a' 
  },
  header: { 
    padding: 40, 
    alignItems: 'center'
  },
  logo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#ffffff' 
  },
  tagline: { 
    fontSize: 14, 
    color: '#38bdf8', 
    marginTop: 8 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  statusText: { 
    fontSize: 20, 
    color: '#10b981', 
    fontWeight: 'bold' 
  },
  infoText: { 
    fontSize: 14, 
    color: '#94a3b8', 
    marginTop: 12 
  },
  footer: { 
    padding: 30, 
    paddingBottom: 50 
  },
  btn: { 
    backgroundColor: '#1e293b', 
    padding: 20, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#38bdf8', 
    alignItems: 'center' 
  },
  btnText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
