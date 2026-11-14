import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { supabase } from '../../supabase'; // Subimos dos niveles

export default function PerfilScreen() {
  const [usuarioId, setUsuarioId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [foto, setFoto] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png'); // Avatar por defecto

  useEffect(() => {
    obtenerDatosPerfil();
  }, []);

  const obtenerDatosPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUsuarioId(user.id);
      
      // Buscar si el usuario ya tiene datos guardados en la tabla "usuarios"
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setNombre(data.nombre_completo || '');
        setEdad(data.edad ? data.edad.toString() : '');
        setTarjeta(data.tarjeta_credito || '');
        setFoto(data.fotografia || foto);
      }
    }
  };

  const guardarPerfil = async () => {
    // Upsert inserta el registro si no existe, o lo actualiza si ya existe
    const { error } = await supabase
      .from('usuarios')
      .upsert({
        id: usuarioId,
        nombre_completo: nombre,
        edad: parseInt(edad),
        tarjeta_credito: tarjeta,
        fotografia: foto,
        rol: 'cliente' // Por defecto
      });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      
      {/* Fotografía del usuario */}
      <Image source={{ uri: foto }} style={styles.imagen} />
      
      <TextInput 
        style={styles.input} 
        placeholder="Nombre Completo" 
        value={nombre} 
        onChangeText={setNombre} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Edad" 
        value={edad} 
        onChangeText={setEdad} 
        keyboardType="numeric" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="No. de Tarjeta de Crédito" 
        value={tarjeta} 
        onChangeText={setTarjeta} 
        keyboardType="numeric" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="URL de Fotografía (Opcional)" 
        value={foto} 
        onChangeText={setFoto} 
      />
      
      <Button title="Guardar Datos" onPress={guardarPerfil} color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  imagen: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, backgroundColor: '#ddd' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5, width: '100%', backgroundColor: '#fff' }
});