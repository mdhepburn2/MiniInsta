// File: post.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: detail screen that shows a single post

import { useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { ScrollView, ActivityIndicator, Text, View } from "react-native";
import { mediaUrl } from "@/constants/api";
import { useAuth } from "@/components/AuthContext";
import { useColors } from "@/components/Themed";
import { Centered, MessageText, PostAuthor, PhotoCarousel } from '@/assets/styles';

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

    const posted = new Date(post.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    // Author on top, then the photos, then caption and date, like a feed post opened up
    return(
        <ScrollView
        style={{ flex: 1, backgroundColor: c.background }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40, gap: 16 }}
        contentInsetAdjustmentBehavior="automatic"
        >
            <Stack.Screen options={{ title: 'Post', headerBackTitle: back }} />
            <View style={{ paddingHorizontal: 16 }}>
                <PostAuthor
                    href={{ pathname: '/profile', params: { pk: post.profile_json.pk } }}
                    photo={mediaUrl(post.profile_json.pfp_url)}
                    name={post.profile_json.display_name}
                    username={post.profile_json.username}
                />
            </View>
            <PhotoCarousel uris={post.all_photos.map((photo: any) => mediaUrl(photo.url))} />
            <View style={{ paddingHorizontal: 20, gap: 6 }}>
                {!!post.caption && (
                    <Text selectable style={{ color: c.text, fontSize: 17, lineHeight: 24 }}>
                        {post.caption}
                    </Text>
                )}
                <Text style={{ color: c.secondaryText, fontSize: 13 }}>{posted}</Text>
            </View>
        </ScrollView>
    )
}