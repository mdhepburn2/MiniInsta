import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';

export default function AllProfiles() {

  const [profiles, setProfiles] = useState()

  const fetchData = async () => {
    const profilesResponse = await fetch('http://10.239.127.250:8000/mini_insta/api/profiles')
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
          <Image source={{ uri: item.pfp_url}} style={{height: 100, width: 100, borderRadius: 50}}/>
          <Text>@{item.username}</Text>
        </View>
      )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
