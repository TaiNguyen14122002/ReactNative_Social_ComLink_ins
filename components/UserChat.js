import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";
import jwt_decode from 'jwt-decode';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const UserChat = ({ item }) => {
  console.log("Item: ", item); 
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://192.168.137.57:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
    } catch (error) {
      console.log("error fetching messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  console.log(messages);

  const getLastMessage = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const n = userMessages.length;

    return userMessages[n - 1];
  };
  const lastMessage = getLastMessage();
  console.log(lastMessage);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  


  useEffect(() => {
    const fetchUserData = async () => {
        try {
            // Retrieve authentication token from AsyncStorage
            const token = await AsyncStorage.getItem('authToken');

            // Decode the token to extract user ID
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;

            // Make a GET request to fetch user data
            const response = await axios.get(`http://192.168.137.57:8000/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include authentication token in the request headers
                },
            });

            // Set the fetched user data in state
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUserData(); // Call fetchUserData when the component mounts
}, []); 
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Messages", {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#D0D0D0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: `${item?.image}`}}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.name}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>

      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserChat;

const styles = StyleSheet.create({});
