import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { styles } from '@/assets/styles';
import { Link } from 'expo-router';
import { url } from '@/constants/api';
import { mediaUrl } from '@/constants/api';
import { useAuth } from '@/components/AuthContext';

export default function AllProfiles() {
  const { authFetch } = useAuth()

  const [profiles, setProfiles] = useState()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const profilesResponse = await authFetch(url + 'profiles')
      const allProfiles = await profilesResponse.json()
      setProfiles(allProfiles.results)
      setError(null)
    } catch (e) {
      console.error('Failed to load profiles:', e)
      setError('Could not load profiles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <FlatList
    contentContainerStyle={styles.profileList}
    data={profiles}
    ListEmptyComponent={() => (loading ? <ActivityIndicator size="large" /> : error ? <Text style={styles.profileUsername}>{error}</Text> : null)}
    renderItem={({item}) => (
        <Link href={{ pathname: '/profile', params:{ pk: item.pk } }} asChild>
          <Pressable style={({ pressed }) => [styles.profileCard, pressed && styles.profileCardPressed]}>
            <Image source={{ uri: mediaUrl(item.pfp_url) }} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{item.display_name}</Text>
              <Text style={styles.profileUsername}>@{item.username}</Text>
            </View>
          </Pressable>
        </Link>
    )}
    ListHeaderComponent={() => (
      <View style={[styles.container, styles.transparent]}>
        <Text style={styles.title}>All Profiles</Text>
      </View>
    )}
    />
  );
}
