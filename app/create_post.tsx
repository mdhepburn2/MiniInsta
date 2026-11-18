// File: create_post.tsx
// Description: screen that lets the logged-in user create a new post
// with up to 10 photos and a caption

import { Host, Column, Button, Text as UIText, TextInput, useNativeState } from '@expo/ui';
import { useAuth } from '@/components/AuthContext';
import { Text, View } from '@/components/Themed';
import { url } from '@/constants/api';
import { File as FSFile } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';

const MAX_PHOTOS = 10;

export default function CreatePost(){
    const { authFetch, profileId } = useAuth()
    const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([])
    const [posting, setPosting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // caption lives in native state so typing never flickers
    const caption = useNativeState('')
    const onChangeCaption = useCallback((value: string) => {
        'worklet';
        caption.set(value)
    }, [caption])

    const remaining = MAX_PHOTOS - photos.length

    const pickPhotos = async () => {
        if (remaining <= 0) return
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            orderedSelection: true,
            quality: 0.8,
            // iOS: hand back JPEGs instead of HEIC so Django/Pillow and every
            // client can read the uploaded images
            preferredAssetRepresentationMode:
                ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        })
        if (result.canceled) return
        // selectionLimit isn't enforced on every platform (e.g. web), so cap here too
        setPhotos(prev => [...prev, ...result.assets].slice(0, MAX_PHOTOS))
        setError(null)
    }

    const removePhoto = (uri: string) => {
        setPhotos(prev => prev.filter(p => p.uri !== uri))
    }

    const submit = async () => {
        if (photos.length === 0) {
            setError('Select at least one photo.')
            return
        }
        setPosting(true)
        setError(null)
        try {
            const body = new FormData()
            body.append('caption', caption.get())
            photos.forEach(photo => {
                if (Platform.OS === 'web' && photo.file) {
                    body.append('files', photo.file)
                } else {
                    // Expo's fetch (the global fetch since SDK 54) can't send React
                    // Native's { uri, name, type } objects; it needs a Blob-like
                    // part, which expo-file-system's File provides
                    body.append('files', new FSFile(photo.uri))
                }
            })

            // don't set Content-Type: fetch adds the multipart boundary itself
            const res = await authFetch(`${url}profile/${profileId}/posts`, {
                method: 'POST',
                body,
            })
            if (!res.ok) throw new Error(`Server responded ${res.status}`)

            setPhotos([])
            caption.set('')
            if (router.canGoBack()) router.back()
            else Alert.alert('Posted', 'Your post was shared.')
        } catch (e) {
            console.error('Failed to create post:', e)
            setError('Could not create your post. Please try again.')
        } finally {
            setPosting(false)
        }
    }

    return(
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardDismissMode="interactive"
            contentContainerStyle={local.page}
        >
            <Stack.Screen options={{ title: 'New Post', headerBackTitle: 'Back' }} />

            {/* select photos */}
            <View style={local.section}>
                {photos.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={local.thumbRow}>
                        {photos.map(photo => (
                            <View key={photo.uri} style={local.thumbWrap}>
                                <Image source={{ uri: photo.uri }} style={local.thumb} />
                                <Pressable
                                    onPress={() => removePhoto(photo.uri)}
                                    style={local.removeBtn}
                                    hitSlop={8}
                                    accessibilityLabel="Remove photo"
                                >
                                    <Text style={local.removeText}>✕</Text>
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                )}
                <Host matchContents>
                    <Column spacing={4} alignment="center">
                        <Button
                            variant="outlined"
                            label={photos.length === 0 ? 'Select Photos' : 'Add More Photos'}
                            onPress={pickPhotos}
                            disabled={remaining <= 0 || posting}
                        />
                        <UIText>{`${photos.length} / ${MAX_PHOTOS} photos`}</UIText>
                    </Column>
                </Host>
            </View>

            {/* caption */}
            <View style={local.section}>
                <Host matchContents={{ vertical: true }} style={local.fullWidth}>
                    <TextInput
                        value={caption}
                        onChangeText={onChangeCaption}
                        placeholder="Write a caption..."
                        multiline
                        numberOfLines={4}
                        editable={!posting}
                    />
                </Host>
            </View>

            {/* post */}
            {error && <Text style={local.error}>{error}</Text>}
            {posting ? (
                <ActivityIndicator size="large" />
            ) : (
                <Host matchContents>
                    <Button
                        variant="filled"
                        label="Post"
                        onPress={submit}
                        disabled={photos.length === 0}
                    />
                </Host>
            )}
        </ScrollView>
    )
}

const local = StyleSheet.create({
    page: {
        padding: 20,
        gap: 24,
        alignItems: 'center',
    },
    section: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'transparent',
    },
    fullWidth: {
        width: '100%',
    },
    thumbRow: {
        gap: 8,
    },
    thumbWrap: {
        backgroundColor: 'transparent',
    },
    thumb: {
        width: 110,
        height: 110,
        borderRadius: 8,
    },
    removeBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
    },
    error: {
        color: '#d33',
    },
})
