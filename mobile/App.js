import * as React from 'react';
import { SafeAreaView, Platform, StatusBar  } from 'react-native';
import { WebView  } from 'react-native-webview';
import { useURL } from 'expo-linking';

const host = "https://purchaseplan.io"
const entry = "/app/auth/login"
const defaultURL = host + entry

export default function() {
  const entry = useURL();
  const uri = entry && entry.includes(host) ? entry : defaultURL;
  const isAndroid = Platform.OS === "android";

  if (isAndroid) {
    StatusBar.setBackgroundColor("#1d1d42")
  }
  StatusBar.setBarStyle("light-content")

  return (
    <SafeAreaView
      style={{ 
        flex: 1, 
        paddingTop: isAndroid ? StatusBar.currentHeight : 0,
        backgroundColor: "#1d1d42",
      }} 
    >
      <WebView 
        source={{ uri }} 
        style={{ height: "100%", width: "100%", backgroundColor: "#1d1d42" }} 
        injectedJavaScriptBeforeContentLoaded="window.isNativeApp=true;"
      />
    </SafeAreaView>
  );
}
