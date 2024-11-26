import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../firebase";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [formWarning, setFormWarning] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (email === "" || password === "" || phone === "" || !validateEmail(email)) {
      setIsButtonDisabled(true);
      if (!validateEmail(email) && email !== "") {
        setEmailWarning("Please enter a valid email address.");
      } else {
        setEmailWarning("");
      }
      if (email === "" || password === "" || phone === "") {
        setFormWarning("All fields are required.");
      } else {
        setFormWarning("");
      }
    } else {
      setIsButtonDisabled(false);
      setEmailWarning("");
      setFormWarning("");
    }
  }, [email, password, phone]);

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user.email;
        const uid = userCredentials.user.uid;

        setDoc(doc(db, "users", `${uid}`), {
          email: user,
          phone: phone,
        });

        navigation.navigate("Main"); // Navigate to the main screen upon successful registration
      })
      .catch((error) => {
        console.log("Error during registration:", error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create an Account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            placeholderTextColor={"#999"}
            style={styles.input}
          />
          {emailWarning ? <Text style={styles.warningText}>{emailWarning}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            placeholder="Enter Password"
            placeholderTextColor={"#999"}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder="Enter your Phone No"
            placeholderTextColor={"#999"}
            style={styles.input}
          />
        </View>

        {formWarning ? <Text style={styles.warningText}>{formWarning}</Text> : null}

        <Pressable
          onPress={register}
          style={[
            styles.registerButton,
            { backgroundColor: isButtonDisabled ? "#9E9E9E" : "#388E3C" },
          ]}
          disabled={isButtonDisabled}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.signInTextContainer}
        >
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 16,
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#388E3C",
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "500",
    color: "#388E3C",
  },
  inputContainer: {
    marginVertical: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4CAF50",
  },
  input: {
    fontSize: 16,
    borderBottomColor: "#388E3C",
    borderBottomWidth: 1,
    marginVertical: 10,
    paddingVertical: 5,
    color: "#388E3C",
  },
  warningText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 5,
  },
  registerButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  registerButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInTextContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  signInText: {
    color: "#666",
    fontSize: 16,
  },
  signInLink: {
    color: "#388E3C",
    fontWeight: "600",
  },
});
