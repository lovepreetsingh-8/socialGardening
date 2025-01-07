import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";


export default function SuccessfulPayment({route}) {
    const { item } = route.params;
    const { totalCost } = route.params;
    const navigation = useNavigation();
  return (
    
    <View style={styles.screenContainer}>
  <Ionicons name="checkmark-circle" size={100} color="#2D572C" />
  <Text style={styles.thankYouText}>Thank you for your payment!</Text>

  <View style={styles.summaryContainer}>
    <Text style={styles.summaryTitle}>Order Summary</Text>
    <Text style={styles.summaryItem}>Item Name: {item.name}</Text>
    <Text style={styles.summaryItem}>Location: {item.location}</Text>
    <Text style={styles.summaryItem}>Total Paid: ${totalCost}</Text>
  </View>

  {/* <View style={styles.paymentDetails}>
    <Text style={styles.detailsTitle}>Payment Details</Text>
    <Text style={styles.detailsItem}>Payment Method: Stripe - Visa</Text>
    <Text style={styles.detailsItem}>Transaction ID: XYZ123456</Text>
    <Text style={styles.detailsItem}>Status: Successful</Text>
  </View> */}

  <TouchableOpacity 
    style={styles.button} 
    onPress={() => navigation.navigate("Main")}>
    <Text style={styles.buttonText}>Back to Home</Text>
  </TouchableOpacity>
</View>

  )
}

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      padding: 20,
    },
    thankYouText: {
      fontSize: 24,
      fontWeight: '700',
      color: '#2D572C',
      marginBottom: 20,
      textAlign: 'center',
    },
    summaryContainer: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 10,
    },
    summaryItem: {
      fontSize: 16,
      marginBottom: 8,
    },
    paymentDetails: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    detailsTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 10,
    },
    detailsItem: {
      fontSize: 16,
      marginBottom: 8,
    },
    button: {
      backgroundColor: '#2D572C',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
  });
  