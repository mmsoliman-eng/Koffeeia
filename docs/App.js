import { useRef, useState, useEffect } from "react";
import { View, StyleSheet, BackHandler, StatusBar, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const APP_URL = "https://mmsoliman-eng.github.io/Koffeeia/";

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07070F" />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#C8963E" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: APP_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#07070F" },
  loader: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: "#07070F", zIndex: 1 },
  webview: { flex: 1, backgroundColor: "#07070F" },
});
