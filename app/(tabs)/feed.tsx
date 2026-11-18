// File: feed.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: feed screen that displays the posts in the logged-in user's feed

import { FlatList, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useColors } from '@/components/Themed';
import { useAuth } from '@/components/AuthContext';
import { FittedImage, Centered, MessageText, Tappable } from '@/assets/styles';
import { useEffect, useState } from 'react';
import { url, mediaUrl } from '@/constants/api';

export default function Feed(){
    const { authFetch, profileId } = useAuth()
    const c = useColors()
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState<any>()
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
            const postsResponse = await authFetch(`${url}profile/${profileId}/feed`)

            const posts = await postsResponse.json()

            setPosts(posts.results)
            setError(null)
        } catch (e) {
            console.error('Failed to load feed:', e)
            setError('Could not load your feed. Please try again.')
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
                <Stack.Screen options={{ headerBackTitle: 'Back' }} />
                <ActivityIndicator size="large" />
            </Centered>
        )
    }
    if(error || !posts){
        return(
            <Centered>
                <Stack.Screen options={{ headerBackTitle: 'Back' }} />
                <MessageText>{error ?? 'Feed not found.'}</MessageText>
            </Centered>
        )
    }

    // One photo per row at its own proportions, with rounded corners like the web feed
    return(
        <FlatList
        style={{ flex: 1, backgroundColor: c.background }}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        contentInsetAdjustmentBehavior="automatic"
        data={posts}
        refreshing={refreshing}
        onRefresh={onRefresh}
        numColumns={1}
        renderItem={({item}) => (
            <Link href={{ pathname: '/post', params:{ pk: item.pk } }} asChild>
                <Tappable pressedOpacity={0.85} style={{ borderRadius: 16, borderCurve: 'continuous', overflow: 'hidden' }}>
                    <FittedImage uri={mediaUrl(item.first_photo.url)} />
                </Tappable>
            </Link>
        )}
        />
    )
}