// MyListingsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Button, Alert } from 'react-native';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const MyListingsScreen = () => {
  const [myListings, setMyListings] = useState([]);
  const navigation = useNavigation();
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    if (currentUserEmail) {
      const q = query(collection(db, 'listings'), where('host_email', '==', currentUserEmail));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyListings(listings);
      });

      return () => unsubscribe();
    }
  }, [currentUserEmail]);

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'listings', id));
              Alert.alert('Success', 'Listing deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete listing. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('EditListing', { item });
  };

  return (
    <ScrollView style={styles.container}>
      {myListings.length > 0 ? (
        myListings.map(item => (
          <View key={item.id} style={styles.listing}>
            <TouchableOpacity onPress={() => navigation.navigate('Details', { item })}>
              <Image source={{ uri: item.medium_url }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.price}>€{item.price} / Duration</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have not created any listings yet.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listing: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    margin: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  details: {
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});

export default MyListingsScreen;
