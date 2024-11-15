import { 
  addDoc, 
  collection, 
  onSnapshot, 
  orderBy, 
  query, 
  Timestamp 
} from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import { 
  FlatList, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { auth, db } from '../firebase';

const MessagesScreen = ({ route }) => {
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const currentUserEmail = auth.currentUser?.email;
  const flatListRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, 'messages', chatId, 'chat'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [chatId]);

  const sendMessage = async () => {
    if (message.trim()) {
      await addDoc(collection(db, 'messages', chatId, 'chat'), {
        sender: currentUserEmail,
        message,
        createdAt: Timestamp.now(),
      });
      setMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === currentUserEmail ? styles.userMessage : styles.ownerMessage}>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type your message..."
        />
        <Pressable onPress={sendMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    padding: 8,
    marginVertical: 2,
    backgroundColor: '#d1e7ff',
  },
  ownerMessage: {
    alignSelf: 'flex-start',
    padding: 8,
    marginVertical: 2,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    padding: 8,
    color: '#007AFF',
  },
});
