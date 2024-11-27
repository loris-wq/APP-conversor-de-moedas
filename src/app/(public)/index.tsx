import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Button } from "@/components/Button";
import { useOAuth } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const googleOAuth = useOAuth({ strategy: "oauth_google" });

  async function onGoogleSignIn() {
    try {
      setIsLoading(true);
      const redirectUrl = Linking.createURL("/");
      const oAuthFlow = await googleOAuth.startOAuthFlow({ redirectUrl });

      if (oAuthFlow.authSessionResult?.type === "success") {
        if (oAuthFlow.setActive) {
          await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId });
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Conversor de Moedas</Text>
      <Text style={styles.description}>
        Converta facilmente valores em reais (BRL) para dólares (USD) e euros
        (EUR) em tempo real. Faça login para começar!
      </Text>
      <Button style={styles.button}
      
        icon="logo-google"
        title="Entrar com Google"
        onPress={onGoogleSignIn}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  button:{
    backgroundColor: "#274360",
    width: 300,
    height: 60,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
}); 