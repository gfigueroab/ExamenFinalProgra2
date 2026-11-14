import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabase'; 
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error al iniciar sesión', error.message);
    } else {
      // Navega a la pantalla del menú de películas (que crearemos después)
      router.replace('/home');
    }
    setLoading(false);
  };

  const handleRegistro = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Error en el registro', error.message);
    } else {
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renta Virtual de Películas</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión" onPress={handleLogin} disabled={loading} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleRegistro} disabled={loading} color="#28a745" />
      </View>
    </View>
  );
  <View style={{ marginTop: 20 }}>
        <Button 
          title="Modo Catedrático (Entrar como Admin)" 
          onPress={() => router.replace('/admin')} 
          color="#6c757d" 
        />
      </View>
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  buttonContainer: { marginBottom: 10 }
});