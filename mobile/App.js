import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Platform, StatusBar, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useURL } from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import NetInfo from "@react-native-community/netinfo";

const host = "http://localhost:3000";
const entry = "/app/auth/login";
const defaultURL = host + entry;

const defaultBackgroundColor = "#1d1d42";
const errorBackgroundColor = "#cf2e2e";

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function () {
  const entry = useURL();
  const uri = entry && entry.includes(host) ? entry : defaultURL;
  const isAndroid = Platform.OS === "android";

  function handleConnectionUpdate(state) {
    if (state.isConnected) {
      StatusBar.setBackgroundColor(defaultBackgroundColor);
    } else {
      StatusBar.setBackgroundColor(errorBackgroundColor);
    }
  }

  useEffect(function () {
    if (isAndroid) {
      StatusBar.setBackgroundColor(defaultBackgroundColor);
    }
    StatusBar.setBarStyle("light-content");

    // Fetch network status and subscribe to updates.
    NetInfo.fetch().then(handleConnectionUpdate);
    const unsubscribe = NetInfo.addEventListener(handleConnectionUpdate);

    return function () {
      unsubscribe();
    };
  }, []);

  function handleWebViewLoad() {
    SplashScreen.hideAsync().catch(() => {});
  }

  function handleWebViewError() {}

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
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
      />
    </SafeAreaView>
  );
}
