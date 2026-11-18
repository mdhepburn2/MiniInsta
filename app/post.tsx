// File: post.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: detail screen that shows a single post

import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { FlatList, ActivityIndicator, Text } from "react-native";
import { mediaUrl } from "@/constants/api";
import { useAuth } from "@/components/AuthContext";
import { useColors } from "@/components/Themed";
import { FittedImage, Centered, MessageText } from '@/assets/styles';

export default function Post(){
    const { authFetch } = useAuth()
    const { pk, username } = useLocalSearchParams()
    const c = useColors()
    const [post, setPost] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const back = username === undefined ? 'Back' : `@${username}`

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
            <Centered>
                <Stack.Screen options={{ title: 'Post', headerBackTitle: back }} />
                <ActivityIndicator size="large" />
            </Centered>
        )
    }
    if(error || !post){
        return(
            <Centered>
                <Stack.Screen options={{ title: 'Post', headerBackTitle: back }} />
                <MessageText>{error ?? 'Post not found.'}</MessageText>
            </Centered>
        )
    }

    return(
        <>
        <Stack.Screen options={{ title: 'Post', headerBackTitle: back }} />
        <FlatList
        style={{ flex: 1, backgroundColor: c.background }}
        contentContainerStyle={{ gap: 2 }}
        contentInsetAdjustmentBehavior="automatic"
        data={post.all_photos}
        numColumns={1}
        // Photos run edge to edge at their own proportions, never cropped
        renderItem={({item}) => (
            <FittedImage uri={mediaUrl(item.url)} minRatio={0.5} maxRatio={3} resizeMode="contain" />
        )}
        ListFooterComponent={() => (
            <Text selectable style={{ color: c.text, fontSize: 17, lineHeight: 24, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
                {post.caption}
            </Text>
        )}
        />
        </>
    )
}