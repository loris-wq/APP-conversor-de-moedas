import { Button } from "@/components/Button";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from "react-native";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [amountBRL, setAmountBRL] = useState<string>("");
  const [convertedUSD, setConvertedUSD] = useState<string | null>(null);
  const [convertedEUR, setConvertedEUR] = useState<string | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [eurRate, setEurRate] = useState<number | null>(null);

  // Função para obter as cotações atuais
  const fetchRates = async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/BRL`
      );
      const data = await response.json();
      
      setUsdRate(data.rates.USD);
      setEurRate(data.rates.EUR);
    } catch (error) {
      console.error("Erro ao obter cotações:", error);
      alert("Não foi possível obter as cotações. Tente novamente mais tarde.");
    }
  };

  // Função para converter BRL para USD e EUR
  const convertCurrency = () => {
    Keyboard.dismiss();
    const amount = parseFloat(amountBRL);

    if (isNaN(amount) || usdRate === null || eurRate === null) {
      alert("Por favor, insira um valor válido e aguarde as cotações.");
      return;
    }

    setConvertedUSD((amount * usdRate).toFixed(2));
    setConvertedEUR((amount * eurRate).toFixed(2));
  };

  useEffect(() => {
    // Obtém as cotações ao carregar a tela e a cada 10 minutos
    fetchRates();
    const interval = setInterval(fetchRates, 600000); // Atualiza a cada 10 minutos

    return () => clearInterval(interval);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Olá, {user?.fullName}</Text>
      
      <Text style={styles.description}>Converter valores de BRL para USD e EUR com cotações atualizadas automaticamente.</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o valor em BRL"
        placeholderTextColor="#6E6E6E"
        keyboardType="numeric"
        value={amountBRL}
        onChangeText={(text) => setAmountBRL(text)}
      />

      <TouchableOpacity style={styles.button} onPress={convertCurrency}>
        <Text style={styles.buttonText}>Converter</Text>
      </TouchableOpacity>

      {usdRate !== null && eurRate !== null && (
        <View style={styles.ratesContainer}>
          <Text style={styles.rateText}>Cotação USD: ${usdRate.toFixed(2)}</Text>
          <Text style={styles.rateText}>Cotação EUR: €{eurRate.toFixed(2)}</Text>
        </View>
      )}

      {convertedUSD && (
        <Text style={styles.resultText}>USD: ${convertedUSD}</Text>
      )}
      {convertedEUR && (
        <Text style={styles.resultText}>EUR: €{convertedEUR}</Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 40,
    position: "absolute",
    top: 20,
    left: 20,
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "85%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFF",
    marginBottom: 16,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  button: {
    backgroundColor: "#274360",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  ratesContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  rateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  resultText: {
    fontSize: 18,
    color: "#1C1C1C",
    marginTop: 16,
    fontWeight: "500",
    backgroundColor: "#E8EDF2",
    padding: 12,
    borderRadius: 8,
    width: "85%",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});