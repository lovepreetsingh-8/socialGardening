import { addDoc, collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { auth, db } from '../firebase';

const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const currentUserEmail = auth.currentUser?.email;

  useEffect(() => {
    const q = query(
      collection(db, 'messages', chatId, 'chat'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, 'messages', chatId, 'chat'), {
        sender: currentUserEmail,
        message,
        createdAt: Timestamp.now(),
      });
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === currentUserEmail ? styles.userMessage : styles.ownerMessage}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Dismiss the keyboard when tapping outside of the input */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.chatContainer}>
          <FlatList 
            data={messages} 
            renderItem={renderMessage} 
            keyExtractor={(item) => item.id} 
            contentContainerStyle={styles.messageList}
          />
          
          {/* Message input container */}
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#888"
            />
            <Pressable onPress={sendMessage}>
              <Text style={styles.sendButton}>Send</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageList: {
    paddingBottom: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ownerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    padding: 12,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  sendButton: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
