import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, Link } from "expo-router";
import { styles } from "@/assets/styles";
import { useState, useEffect } from "react";
import { url } from "@/constants/api";
import { Image, FlatList, Pressable } from "react-native";



export default function profile(){
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
    // console.log(posts)

    return(
        <View style={styles.container}>
            <Image source={{ uri: profile.pfp_url}} style={{height: 100, width: 100, borderRadius: 50}}/>
            <Text>{profile.display_name}</Text>
            <Text>@{profile.username}</Text>
            <FlatList
            data={posts}
            renderItem={({item}) => (
                <Link href={{ pathname: '/post', params:{ pk: item.pk } }} asChild>
                    <Pressable>
                        <Image source={{ uri: item.first_photo.url}} style={{height: 100, width: 100}}/>
                    </Pressable>
                </Link>
            )}
            />
        </View>
    )
}