// import React, { useEffect, useState } from "react";
// import { View, FlatList, Text, Image, StyleSheet } from "react-native";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { db } from "../firebase";

// export default function PaymentsScreen() {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     const fetchPayments = () => {
//       const paymentQuery = query(
//         collection(db, "Payment"),
//         where("status", "==", "success")
//       );

//       const unsubscribe = onSnapshot(paymentQuery, (snapshot) => {
//         const paymentList = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPayments(paymentList);
//       });

//       return unsubscribe;
//     };

//     const unsubscribe = fetchPayments();
//     return () => unsubscribe();
//   }, []);

//   const renderPaymentItem = ({ item }) => {
//     const leaseDuration = (item.amountPaid / item.price); // Calculate months
//     return (
//       <View style={styles.paymentCard}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//         <View style={styles.details}>
//           <Text style={styles.title}>{item.property_name}</Text>
//           <Text style={styles.subtitle}>Hosted by: {item.owner}</Text>
//           <Text style={styles.subtitle}>Amount Paid: ${item.amountPaid}</Text>
//           <Text style={styles.subtitle}>
//             Lease Duration: {leaseDuration} months
//           </Text>
//           <Text style={styles.subtitle}>
//             Time: {item.timestamp.toDate().toLocaleString()}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {payments.length === 0 ? (
//         <Text style={styles.noPaymentText}>No successful payments found</Text>
//       ) :(
//       <FlatList
//         data={payments}
//         keyExtractor={(item) => item.id}
//         renderItem={renderPaymentItem}
//         contentContainerStyle={styles.list}
//       />)}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//     marginTop: 10
//   },
//   noPaymentText:{
//     fontSize: 20,
//     textAlign: 'center',
//     marginVertical: 20
    
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2D572C",
//     textAlign: "center",
//     marginVertical: 16,
//   },
//   list: {
//     paddingHorizontal: 16,
//   },
//   paymentCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//     padding: 16,
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
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#2D572C",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 4,
//   },
// });
