import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, Link } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList, Pressable } from "react-native";
import { mediaUrl } from "@/constants/api";



export default function Profile(){
    const { pk } = useLocalSearchParams()
    // console.log(pk)

    const [profile, setProfile] = useState<any>()
    const [posts, setPosts] = useState<any>()
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        const profileResponse = await fetch(url + 'profile/' + pk)
        const postsResponse = await fetch(url + 'profile/' + pk + '/posts')

        const profile = await profileResponse.json()
        const posts = await postsResponse.json()

        setProfile(profile)
        setPosts(posts.results)

        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    if(loading){
        return(
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }
    console.log(posts)

return(
        <View style={styles.profilePage}>
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