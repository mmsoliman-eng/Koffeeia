import { useRef, useState } from "react";
import { View, StyleSheet, BackHandler, StatusBar, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [htmlUri, setHtmlUri] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const asset = Asset.fromModule(require("./assets/webapp.html"));
        await asset.downloadAsync();
        let uri = asset.localUri || asset.uri;

        // On Android, copy into the document directory so the WebView
        // (and any relative asset loading) can reliably read the file.
        if (Platform.OS === "android" && uri) {
          const dest = FileSystem.documentDirectory + "webapp.html";
          await FileSystem.copyAsync({ from: uri, to: dest });
          uri = dest;
        }
        setHtmlUri(uri);
      } catch (e) {
        console.warn("Failed to load webapp.html", e);
      }
    })();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [canGoBack]);

  if (!htmlUri) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07070F" />
      <WebView
        ref={webViewRef}
        source={{ uri: htmlUri }}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07070F",
  },
  webview: {
    flex: 1,
    backgroundColor: "#07070F",
  },
});
