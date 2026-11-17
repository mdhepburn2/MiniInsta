import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable } from 'react-native';
import { styles } from '@/assets/styles';
import { Link } from 'expo-router';
import { url } from '@/constants/api';
import { mediaUrl } from '@/constants/api';

export default function AllProfiles() {

  const [profiles, setProfiles] = useState()

  const fetchData = async () => {
    const profilesResponse = await fetch(url + 'profiles')
    const allProfiles = await profilesResponse.json()
    setProfiles(allProfiles.results)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <FlatList
    contentContainerStyle={styles.profileList}
    data={profiles}
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
