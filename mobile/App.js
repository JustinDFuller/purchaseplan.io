import React, { useRef, useEffect, useState } from "react";
import { Linking, SafeAreaView, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useURL } from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { useNotifications } from "./useNotifications";
import { Error } from "./Error";

const host = "https://www.purchaseplan.io";
const entry = "/app/user/list";
const defaultURL = host + entry;

const defaultBackgroundColor = "#0a0a1a";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore errors */
});

export default function App() {
  const [error, setError] = useState(null);
  const webview = useRef(null);

  const { tokens } = useNotifications();
  useEffect(() => {
    if (!webview.current) {
      return;
    }

    if (!tokens) {
      return;
    }

    webview.current.injectJavaScript(`
      window.PURCHASE_PLAN_TOKENS=${JSON.stringify(tokens)};
      window.dispatchEvent(new Event("PURCHASE_PLAN_TOKENS"));
    `);
  }, [tokens, webview]);

  const entry = useURL();
  const uri = entry && entry.includes(host) ? entry : defaultURL;
  const isAndroid = Platform.OS === "android";

  function handleWebViewLoad() {
    SplashScreen.hideAsync().catch(() => {});
    setError(false);
  }

  function handleWebViewError(error) {
    setError(error);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: defaultBackgroundColor,
      }}
    >
      <StatusBar
        style="light"
        backgroundColor={defaultBackgroundColor}
        translucent={false}
      />
      {error ? (
        <Error />
      ) : (
        <WebView
          userAgent="Mozilla/5.0 (X11; CrOS x86_64 14268.51.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.77 Safari/537.36"
          ref={(r) => (webview.current = r)}
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            marginTop: isAndroid ? StatusBar.currentHeight : 0,
          }}
          source={{ uri }}
          injectedJavaScriptBeforeContentLoaded={`
            window.isNativeApp=true;
          `}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onShouldStartLoadWithRequest={(event) => {
            const blacklist = ["blog.purchaseplan.io"];
            if (blacklist.find((b) => event.url.includes(b))) {
              Linking.openURL(event.url);
              return false;
            }

            const whitelist = ["purchaseplan.io", "magic.link"];
            if (!whitelist.find((w) => event.url.includes(w))) {
              Linking.openURL(event.url);
              return false;
            }

            return true;
          }}
        />
      )}
    </SafeAreaView>
  );
}
