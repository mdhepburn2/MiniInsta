import { FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';
import { styles } from '@/assets/styles';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/components/AuthContext';
import { useEffect, useState } from 'react';
import { url, mediaUrl } from '@/constants/api';

export default function UserProfile() {
  const { authFetch, profileId } = useAuth()
  const [profile, setProfile] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any>()
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
      setLoading(true)
      try {
          const profileResponse = await authFetch(url + 'profile/' + profileId)
          const postsResponse = await authFetch(url + 'profile/' + profileId + '/posts')

          const profile = await profileResponse.json()
          const posts = await postsResponse.json()

          setProfile(profile)
          setPosts(posts.results)
          setError(null)
      } catch (e) {
          console.error('Failed to load user profile:', e)
          setError('Could not load your profile. Please try again.')
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
//   console.log(posts)

return(
      <View style={styles.profilePage}>
          <Stack.Screen options={{ title: '@' + profile.username, headerBackTitle: 'Back' }} />
          <FlatList
          style={styles.postGrid}
          contentInsetAdjustmentBehavior="automatic"
          data={posts}
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