import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../supabase'; 
import { router } from 'expo-router';

export default function HomeScreen() {
  const [peliculas, setPeliculas] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    obtenerUsuario();
    obtenerPeliculas();
  }, []);

  const obtenerUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUsuario(user);
  };

  const obtenerPeliculas = async () => {
    const { data, error } = await supabase.from('peliculas').select('*');
    if (error) {
      console.error(error);
    } else {
      setPeliculas(data);
    }
  };

  const rentarPelicula = async (peliculaId) => {
    if (!usuario) {
      return Alert.alert('Error', 'No hay sesión activa');
    }

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaInicio.getDate() + 7);

    const { error } = await supabase
      .from('rentas')
      .insert([
        {
          id_usuario: usuario.id,
          id_pelicula: peliculaId,
          fecha_inicio: fechaInicio.toISOString(),
          fecha_fin: fechaFin.toISOString(),
        }
      ]);

    if (error) {
      Alert.alert('Error al rentar', error.message);
    } else {
      Alert.alert('¡Éxito!', 'Película rentada correctamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de Películas</Text>
      
      {/* Botón nuevo para ir al Perfil */}
      <View style={{ marginBottom: 15 }}>
        <Button title="Ir a Mi Perfil" onPress={() => router.push('/perfil')} color="#17a2b8" />
      </View>
      
      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.movieTitle}>{item.titulo}</Text>
            <Text style={styles.movieDesc}>{item.descripcion}</Text>
            
            <View style={styles.buttonContainer}>
              <Button title="Rentar" onPress={() => rentarPelicula(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, elevation: 2 },
  movieTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  movieDesc: { fontSize: 14, color: '#666', marginBottom: 10 },
  buttonContainer: { marginTop: 10 }
});