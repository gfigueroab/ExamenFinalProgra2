import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '../../supabase';

export default function AdminScreen() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [peliculas, setPeliculas] = useState([]);
  const [informeRentas, setInformeRentas] = useState([]);

  useEffect(() => {
    cargarPeliculas();
    cargarInforme();
  }, []);

  const cargarPeliculas = async () => {
    const { data } = await supabase.from('peliculas').select('*');
    if (data) setPeliculas(data);
  };

  const cargarInforme = async () => {
    
    const { data, error } = await supabase
      .from('rentas')
      .select(`
        id,
        fecha_inicio,
        usuarios ( nombre_completo ),
        peliculas ( titulo )
      `);
    if (data) setInformeRentas(data);
    if (error) console.error(error);
  };

  
  const agregarPelicula = async () => {
    if (!titulo || !descripcion) return Alert.alert('Error', 'Llena todos los campos');
    const { error } = await supabase.from('peliculas').insert([{ titulo, descripcion }]);
    
    if (!error) {
      Alert.alert('Éxito', 'Película agregada');
      setTitulo('');
      setDescripcion('');
      cargarPeliculas(); 
    }
  };

  
  const eliminarPelicula = async (id) => {
    const { error } = await supabase.from('peliculas').delete().eq('id', id);
    if (!error) {
      Alert.alert('Éxito', 'Película eliminada');
      cargarPeliculas();
    } else {
      Alert.alert('Error', 'No se puede eliminar (asegúrate de que nadie la haya rentado aún)');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Panel de Administrador</Text>

      {/* Sección Agregar Película */}
      <View style={styles.section}>
        <Text style={styles.title}>Agregar Película (Inciso 3.a)</Text>
        <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
        <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
        <Button title="Agregar Película" onPress={agregarPelicula} color="#28a745" />
      </View>

      {/* Sección Eliminar Película */}
      <View style={styles.section}>
        <Text style={styles.title}>Eliminar Película (Inciso 3.b)</Text>
        {peliculas.map(item => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.itemText}>{item.titulo}</Text>
            <Button title="Eliminar" onPress={() => eliminarPelicula(item.id)} color="#dc3545" />
          </View>
        ))}
      </View>

      {/* Sección Informe de Rentas */}
      <View style={styles.section}>
        <Text style={styles.title}>Informe de Rentas (Inciso 3.c)</Text>
        {informeRentas.length === 0 ? <Text>No hay rentas registradas.</Text> : null}
        
        {informeRentas.map(renta => (
          <View key={renta.id} style={styles.reportCard}>
            <Text style={styles.bold}>Película: {renta.peliculas?.titulo}</Text>
            <Text>Usuario: {renta.usuarios?.nombre_completo || 'Datos de perfil no llenados'}</Text>
            <Text>Fecha: {new Date(renta.fecha_inicio).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e9ecef' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 20 },
  section: { backgroundColor: '#fff', padding: 15, marginBottom: 20, borderRadius: 8, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  itemText: { fontSize: 16, flex: 1 },
  reportCard: { padding: 10, backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10 },
  bold: { fontWeight: 'bold', color: '#0056b3' }
});