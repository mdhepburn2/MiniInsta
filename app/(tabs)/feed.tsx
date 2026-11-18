import { FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';
import { styles } from '@/assets/styles';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/components/AuthContext';
import { useEffect, useState } from 'react';
import { url, mediaUrl } from '@/constants/api';

export default function Feed(){
    const { authFetch, profileId } = useAuth()
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
            <View style={styles.container}>
                <Stack.Screen options={{ headerBackTitle: 'Back' }} />
                <ActivityIndicator size="large" />
            </View>
        )
    }
    if(error || !posts){
        return(
            <View style={styles.container}>
                <Stack.Screen options={{ headerBackTitle: 'Back' }} />
                <Text>{error ?? 'Feed not found.'}</Text>
            </View>
        )
    }

    return(
        <View style={styles.profilePage}>
          <FlatList
          style={styles.postGrid}
          contentInsetAdjustmentBehavior="automatic"
          data={posts}
          refreshing={refreshing}
          onRefresh={onRefresh}
          numColumns={1}
          renderItem={({item}) => (
              <Link href={{ pathname: '/post', params:{ pk: item.pk } }} asChild>
                  <Pressable style={styles.postTile}>
                      <Image source={{ uri: mediaUrl(item.first_photo.url)}} style={styles.postImage}/>
                  </Pressable>
              </Link>
          )}
          />
      </View>
    )
}