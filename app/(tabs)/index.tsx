// File: index.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: home screen that lists all user profiles

import { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, Text, View } from 'react-native';
import { Avatar, MessageText, Tappable } from '@/assets/styles';
import { Link } from 'expo-router';
import { url } from '@/constants/api';
import { mediaUrl } from '@/constants/api';
import { useAuth } from '@/components/AuthContext';
import { useColors } from '@/components/Themed';

export default function AllProfiles() {
  const { authFetch } = useAuth()
  const c = useColors()

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

  // Two-column grid of ringed photos, like the web app's profile grid
  return (
    <FlatList
    style={{ backgroundColor: c.background }}
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 24, gap: 28 }}
    columnWrapperStyle={{ gap: 12 }}
    numColumns={2}
    data={profiles}
    ListEmptyComponent={() => (
      <View style={{ paddingTop: 64, alignItems: 'center' }}>
        {loading ? <ActivityIndicator size="large" /> : error ? <MessageText>{error}</MessageText> : null}
      </View>
    )}
    renderItem={({item}) => (
        <Link href={{ pathname: '/profile', params:{ pk: item.pk } }} asChild>
          <Tappable style={{ flex: 1, maxWidth: '50%', alignItems: 'center', gap: 10 }}>
            <Avatar uri={mediaUrl(item.pfp_url)} size={136} />
            <View style={{ alignItems: 'center', gap: 1, paddingHorizontal: 4 }}>
              <Text numberOfLines={1} style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>{item.display_name}</Text>
              <Text numberOfLines={1} style={{ color: c.tint, fontSize: 14 }}>@{item.username}</Text>
            </View>
          </Tappable>
        </Link>
    )}
    />
  );
}
