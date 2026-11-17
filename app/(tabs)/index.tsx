import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable } from 'react-native';
import { styles } from '@/assets/styles';
import { Link } from 'expo-router';
import { url } from '@/constants/api';

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
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
      data={profiles}
      renderItem={({item}) => (
        <View>
          <Link href={{ pathname: '/profile', params:{ pk: item.pk } }} asChild>
            <Pressable>
              <Image source={{ uri: item.pfp_url}} style={{height: 100, width: 100, borderRadius: 50}}/>
              <Text>{item.display_name}</Text>
              <Text>@{item.username}</Text>
            </Pressable>
          </Link>
        </View>
      )}
      />
    </View>
  );
}
