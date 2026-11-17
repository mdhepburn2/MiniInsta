import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList } from "react-native";

export default function post(){
    const { pk } = useLocalSearchParams()

    return(
        <View style={styles.container}>
            <Text>Post {pk}</Text>
        </View>
    )
}