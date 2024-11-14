import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { auth, db } from '../firebase';

const ChatListScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUserEmail),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatList(chats);
    });

    return unsubscribe;
  }, []);

  const openChat = (chat) => {
    if (isSelectionMode) {
      toggleSelection(chat.id);
    } else {
      navigation.navigate('Messages', {
        chatId: chat.id,
        ownerEmail: chat.participants.find((email) => email !== currentUserEmail),
        listingName: chat.listingName,
      });
    }
  };

  const toggleSelection = (chatId) => {
    setSelectedChats((prevSelected) =>
      prevSelected.includes(chatId) ? prevSelected.filter((id) => id !== chatId) : [...prevSelected, chatId]
    );
  };

  const confirmDeletion = () => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete the selected chat(s)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteSelectedChats },
      ]
    );
  };

  const deleteSelectedChats = async () => {
    const deletePromises = selectedChats.map((chatId) => deleteDoc(doc(db, 'messages', chatId)));
    await Promise.all(deletePromises);
    setSelectedChats([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode((prevMode) => !prevMode);
    setSelectedChats([]); // Clear selection when entering/exiting selection mode
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.chatItem, selectedChats.includes(item.id) && styles.selectedChatItem]}
      onPress={() => openChat(item)}
    >
      <Text style={styles.chatName}>
        {item.participants.find((email) => email !== currentUserEmail)}
      </Text>
      <Text style={styles.chatPreview}>{item.message || 'messages.'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        {isSelectionMode ? (
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDeletion}>
            <Text style={styles.deleteButtonText}>Delete Selected Chats</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.deleteButton} onPress={toggleSelectionMode}>
            <Text style={styles.deleteButtonText}>Select Chats to Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedChatItem: {
    backgroundColor: '#FFCDD2',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  chatPreview: {
    color: '#666',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
