import { FlatList, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { useColors } from '@/components/Themed';
import { useAuth } from '@/components/AuthContext';
import { PillButton, Centered, MessageText, ProfileHeader, GridTile } from '@/assets/styles';
import { useEffect, useState } from 'react';
import { url, mediaUrl } from '@/constants/api';

export default function UserProfile() {
  const { authFetch, profileId } = useAuth()
  const c = useColors()
  const [profile, setProfile] = useState<any>()
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
          <Centered>
              <Stack.Screen options={{ headerBackTitle: 'Back' }} />
              <ActivityIndicator size="large" />
          </Centered>
      )
  }
  if(error || !profile){
      return(
          <Centered>
              <Stack.Screen options={{ headerBackTitle: 'Back' }} />
              <MessageText>{error ?? 'Profile not found.'}</MessageText>
          </Centered>
      )
  }
//   console.log(posts)

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
              >
                  <PillButton label="New Post" onPress={() => router.push('/create_post')} />
              </ProfileHeader>
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