import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { FlatList, ActivityIndicator } from "react-native";
import { mediaUrl } from "@/constants/api";
import { useAuth } from "@/components/AuthContext";
import { useColors } from "@/components/Themed";
import { Centered, MessageText, ProfileHeader, GridTile } from '@/assets/styles';

export default function Profile(){
    const { authFetch } = useAuth()
    const { pk } = useLocalSearchParams()
    const c = useColors()
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
            <Centered>
                <Stack.Screen options={{ title: 'Profile', headerBackTitle: 'Back' }} />
                <ActivityIndicator size="large" />
            </Centered>
        )
    }
    if(error || !profile){
        return(
            <Centered>
                <Stack.Screen options={{ title: 'Profile', headerBackTitle: 'Back' }} />
                <MessageText>{error ?? 'Profile not found.'}</MessageText>
            </Centered>
        )
    }
    // console.log(posts)

return(
        <>
            <Stack.Screen options={{ title: '@' + profile.username, headerBackTitle: 'Back' }} />
            <FlatList
            style={{ flex: 1, backgroundColor: c.background }}
            contentInsetAdjustmentBehavior="automatic"
            data={posts}
            refreshing={refreshing}
            onRefresh={onRefresh}
            numColumns={3}
            ListHeaderComponent={() => (
                <ProfileHeader
                    photo={mediaUrl(profile.pfp_url)}
                    name={profile.display_name}
                    username={profile.username}
                />
            )}
            renderItem={({item}) => (
                <GridTile
                    href={{ pathname: '/post', params:{ pk: item.pk, username: profile.username } }}
                    photo={mediaUrl(item.first_photo.url)}
                />
            )}
            />
        </>
    )
}