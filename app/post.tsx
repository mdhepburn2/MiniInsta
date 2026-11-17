import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList } from "react-native";
import { mediaUrl } from "@/constants/api";

export default function post(){
    const { pk } = useLocalSearchParams()
    const [post, setPost] = useState<any>()
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        const postResponse = await fetch(url + 'post/' + pk)
        const post = await postResponse.json()
        setPost(post)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    if(loading){
        return(
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    return(
        <FlatList
        data={post.all_photos}
        renderItem={({item}) => (
            <View style={styles.container}>
                <Image source={{ uri: mediaUrl(item.url) }} style={{height: 100, width: 100}}/>
            </View>
        )}
        />
    )
}