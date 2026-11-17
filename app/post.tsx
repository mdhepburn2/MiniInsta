import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList } from "react-native";
import { mediaUrl } from "@/constants/api";

export default function Post(){
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
        style={styles.postDetailList}
        contentContainerStyle={styles.postDetailContent}
        contentInsetAdjustmentBehavior="automatic"
        data={post.all_photos}
        numColumns={1}
        renderItem={({item}) => (
            <View style={styles.postDetailTile}>
                <Image
                    source={{ uri: mediaUrl(item.url) }}
                    style={styles.postDetailImage}
                    resizeMode="contain"
                />
            </View>
        )}
        ListFooterComponent={() => (
            <View style={[styles.postDetailFooter, styles.transparent]}>
                <Text style={styles.postDetailCaption}>{post.caption}</Text>
            </View>
        )}
        />
    )
}