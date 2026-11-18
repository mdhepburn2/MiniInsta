import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList } from "react-native";
import { mediaUrl } from "@/constants/api";
import { useAuth } from "@/components/AuthContext";

export default function Post(){
    const { authFetch } = useAuth()
    const { pk, username } = useLocalSearchParams()
    const [post, setPost] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const back = username === undefined ? 'back' : `@${username}`

    const fetchData = async () => {
        setLoading(true)
        try {
            const postResponse = await authFetch(url + 'post/' + pk)
            const post = await postResponse.json()
            setPost(post)
            setError(null)
        } catch (e) {
            console.error('Failed to load post:', e)
            setError('Could not load this post. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if(loading){
        return(
            <View style={styles.container}>
                <Stack.Screen options={{ headerBackTitle: back}} />
                <Text>Loading...</Text>
            </View>
        )
    }
    if(error || !post){
        return(
            <View style={styles.container}>
                <Stack.Screen options={{ headerBackTitle: back}} />
                <Text>{error ?? 'Post not found.'}</Text>
            </View>
        )
    }

    return(
        <>
        <Stack.Screen options={{ headerBackTitle: back}} />
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
        </>
    )
}