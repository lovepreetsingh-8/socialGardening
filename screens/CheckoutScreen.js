// import React, { useEffect, useState } from "react";
// import { View, Alert, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
// import { useStripe } from "@stripe/stripe-react-native";
// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { db } from "../firebase";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";

// const API_URL = "http://10.243.77.39:8082";

// export default function CheckoutScreen({ route }) {
//   const { item } = route.params;
//   const { totalCost } = route.params;
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();

//   const fetchPaymentSheetParams = async () => {
//     const amountInCents = Math.round(totalCost * 100);
//     if (isNaN(amountInCents) || amountInCents <= 0) {
//       Alert.alert("Invalid amount for payment");
//       return;
//     }

//     const response = await fetch(`${API_URL}/payment-sheet`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: amountInCents }),
//     });

//     const { paymentIntent, ephemeralKey, customer } = await response.json();

//     await addDoc(collection(db, "Payment"), {
//       customerId: customer,
//       ephemeralKey,
//       paymentIntent,
//       amountPaid: totalCost,
//       timestamp: Timestamp.now(),
//     });

//     return { paymentIntent, ephemeralKey, customer };
//   };

//   const initializePaymentSheet = async () => {
//     try {
//       const paymentParams = await fetchPaymentSheetParams();
//       if (!paymentParams) return;

//       const { paymentIntent, ephemeralKey, customer } = paymentParams;

//       const { error } = await initPaymentSheet({
//         customerId: customer,
//         customerEphemeralKeySecret: ephemeralKey,
//         paymentIntentClientSecret: paymentIntent,
//         merchantDisplayName: "Social Garden",
//       });

//       if (error) {
//         Alert.alert("Payment Initialization Failed", error.message);
//         return;
//       }

//       setLoading(true);
//     } catch (error) {
//       Alert.alert("Initialization Error", "Failed to initialize payment sheet.");
//     }
//   };

//   const openPaymentSheet = async () => {
//     const { error } = await presentPaymentSheet();

//     if (error) {
//       Alert.alert(`Error code: ${error.code}`, error.message);
//       navigation.navigate("Main")
//     } else {
//       navigation.navigate("SuccessPayment", {
//         item,
//         totalCost
//       });
//     }
//   };

//   useEffect(() => {
//     initializePaymentSheet();
//   }, []);

//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.container}>
//         <Image source={{ uri: item.medium_url }} style={styles.image} />
//         <View style={styles.details}>
//           <Text style={styles.title}>{item.name}</Text>
//           <Text style={styles.subtitle}>Hosted by: {item.host_name}</Text>
//           <Text style={styles.subtitle}>Location: {item.location}</Text>

          

//           <TouchableOpacity
//             style={[styles.paymentButton, { backgroundColor: loading ? "#2D572C" : "#C8C8C8" }]}
//             disabled={!loading}
//             onPress={openPaymentSheet}
//           >
//             <Ionicons name="card-outline" size={20} color="white" />
//             <Text style={styles.paymentButtonText}>Complete Payment: ${totalCost}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screenContainer: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   container: {
//     padding: 16,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     margin: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   details: {
//     paddingHorizontal: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "#2D572C",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 8,
//   },
//   priceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   priceLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   priceValue: {
//     fontSize: 16,
//     color: "#2D572C",
//   },
//   paymentButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   paymentButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     marginLeft: 8,
//   },
// });


import React, { useEffect, useState, useRef } from "react";
import { View, Alert, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://10.245.67.16:8082";

export default function CheckoutScreen({ route }) {
  const { item, totalCost } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const paymentData = useRef({});

  const fetchPaymentSheetParams = async () => {
    try {
      const amountInCents = Math.round(totalCost * 100);
      if (isNaN(amountInCents) || amountInCents <= 0) {
        Alert.alert("Invalid amount for payment");
        return null;
      }

      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment sheet parameters");
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();
      paymentData.current = { paymentIntent, ephemeralKey, customer }; // Store for later
      return { paymentIntent, ephemeralKey, customer };
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to fetch payment parameters.");
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const paymentParams = await fetchPaymentSheetParams();
      if (!paymentParams) return;

      const { paymentIntent, ephemeralKey, customer } = paymentParams;

      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Social Garden",
      });

      if (error) {
        Alert.alert("Payment Initialization Failed", error.message);
        return;
      }

      setLoading(true); // Enable the payment button
    } catch (error) {
      Alert.alert("Initialization Error", "Failed to initialize payment sheet.");
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = paymentData.current;
      const { error } = await presentPaymentSheet();

      const paymentStatus = error ? "failed" : "success";
      const paymentRecord = {
        customerId: customer,
        ephemeralKey,
        paymentIntent,
        amountPaid: totalCost,
        status: paymentStatus,
        timestamp: Timestamp.now(),
        image: item.medium_url,
        property_name: item.name,
        owner: item.host_name,
        price:item.price,
      };

      if (error) {
        paymentRecord.errorMessage = error.message;
        Alert.alert(`Error code: ${error.code}`, error.message);
        navigation.navigate("Main");
      } else {
        navigation.navigate("SuccessPayment", {
          item,
          totalCost,
        });
      }

      // Add the payment record to Firestore
      await addDoc(collection(db, "Payment"), paymentRecord);
    } catch (error) {
      Alert.alert("Payment Error", error.message || "An error occurred during payment.");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <Image source={{ uri: item.medium_url }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Hosted by: {item.host_name}</Text>
          <Text style={styles.subtitle}>Location: {item.location}</Text>

          <TouchableOpacity
            style={[
              styles.paymentButton,
              { backgroundColor: loading ? "#2D572C" : "#C8C8C8" },
            ]}
            disabled={!loading}
            onPress={openPaymentSheet}
          >
            <Ionicons name="card-outline" size={20} color="white" />
            <Text style={styles.paymentButtonText}>Complete Payment: ${totalCost}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
        flex: 1,
        backgroundColor: "#F5F5F5",
      },
      container: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        margin: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      },
      image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
      },
      details: {
        paddingHorizontal: 10,
      },
      title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#2D572C",
        marginBottom: 8,
      },
      subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
      },
      priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
      },
      priceLabel: {
        fontSize: 16,
        fontWeight: "600",
      },
      priceValue: {
        fontSize: 16,
        color: "#2D572C",
      },
      paymentButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
      },
      paymentButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 8,
      },
});
