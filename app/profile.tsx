import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, Link, Stack } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList, Pressable, ActivityIndicator } from "react-native";
import { mediaUrl } from "@/constants/api";
import { useAuth } from "@/components/AuthContext";

export default function Profile(){
    const { authFetch } = useAuth()
    const { pk } = useLocalSearchParams()
    // console.log(pk)

    const [profile, setProfile] = useState<any>()
    const [posts, setPosts] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchData(true)
        setRefreshing(false)
    }

    const fetchData = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true)
        try {
            const profileResponse = await authFetch(url + 'profile/' + pk)
            const postsResponse = await authFetch(url + 'profile/' + pk + '/posts')

            const profile = await profileResponse.json()
            const posts = await postsResponse.json()

            setProfile(profile)
            setPosts(posts.results)
            setError(null)
        } catch (e) {
            console.error('Failed to load profile:', e)
            setError('Could not load this profile. Please try again.')
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
                <Stack.Screen options={{ headerBackTitle: 'Back' }} />
                <ActivityIndicator size="large" />
            </View>
        )
    }
    if(error || !profile){
        return(
            <View style={styles.container}>
                <Stack.Screen options={{ headerBackTitle: 'Back' }} />
                <Text>{error ?? 'Profile not found.'}</Text>
            </View>
        )
    }
    // console.log(posts)

return(
        <View style={styles.profilePage}>
            <Stack.Screen options={{ title: '@' + profile.username, headerBackTitle: 'Back' }} />
            <FlatList
            style={styles.postGrid}
            contentInsetAdjustmentBehavior="automatic"
            data={posts}
            refreshing={refreshing}
            onRefresh={onRefresh}
            numColumns={3}
            ListHeaderComponent={() => (
                <View style={styles.profileHeader}>
                    <Image source={{ uri: mediaUrl(profile.pfp_url)}} style={styles.profileHeaderAvatar}/>
                    <Text style={styles.profileHeaderName}>{profile.display_name}</Text>
                    <Text style={styles.profileHeaderUsername}>@{profile.username}</Text>
                </View>
            )}
            renderItem={({item}) => (
                <Link href={{ pathname: '/post', params:{ pk: item.pk, username: profile.username } }} asChild>
                    <Pressable style={styles.postTile}>
                        <Image source={{ uri: mediaUrl(item.first_photo.url)}} style={styles.postImage}/>
                    </Pressable>
                </Link>
            )}
            />
        </View>
    )
}