// File: create_post.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: screen that lets the logged-in user create a new post with up to 10 photos and a caption

import { Host, TextInput, useNativeState } from '@expo/ui';
import { SymbolView } from 'expo-symbols';
import { useAuth } from '@/components/AuthContext';
import { useColors } from '@/components/Themed';
import { PillButton } from '@/assets/styles';
import { url } from '@/constants/api';
import { File as FSFile } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

const MAX_PHOTOS = 10;

export default function CreatePost(){
    const { authFetch, profileId } = useAuth()
    const c = useColors()
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

    const thumbSize = 112
    const pickDisabled = remaining <= 0 || posting

    return(
        <ScrollView
            style={{ backgroundColor: c.background }}
            contentInsetAdjustmentBehavior="automatic"
            keyboardDismissMode="interactive"
            contentContainerStyle={{ padding: 20, gap: 24 }}
        >
            <Stack.Screen options={{ title: 'New Post', headerBackTitle: 'Back' }} />

            {/* select photos */}
            <View style={{ gap: 10 }}>
                {photos.length === 0 ? (
                    <Pressable
                        onPress={pickPhotos}
                        disabled={pickDisabled}
                        accessibilityRole="button"
                        accessibilityLabel="Select Photos"
                        style={({ pressed }) => ({
                            height: 220,
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            borderRadius: 20,
                            borderCurve: 'continuous',
                            borderWidth: 1.5,
                            borderStyle: 'dashed',
                            borderColor: c.tint,
                            backgroundColor: pressed ? c.separator : c.surface,
                            opacity: pickDisabled ? 0.45 : 1,
                        })}
                    >
                        <SymbolView
                            name={{ ios: 'photo.on.rectangle.angled', android: 'add_photo_alternate', web: 'add_photo_alternate' }}
                            tintColor={c.tint as string}
                            size={34}
                        />
                        <Text style={{ color: c.tint, fontSize: 17, fontWeight: '600' }}>Select Photos</Text>
                    </Pressable>
                ) : (
                    // bleeds past the page padding so thumbnails scroll edge to edge
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginHorizontal: -20 }}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
                    >
                        {photos.map(photo => (
                            <View key={photo.uri}>
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{ width: thumbSize, height: thumbSize, borderRadius: 12, backgroundColor: c.surface }}
                                />
                                <Pressable
                                    onPress={() => removePhoto(photo.uri)}
                                    hitSlop={8}
                                    accessibilityLabel="Remove photo"
                                    style={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.6)',
                                    }}
                                >
                                    <SymbolView
                                        name={{ ios: 'xmark', android: 'close', web: 'close' }}
                                        tintColor="#fff"
                                        size={11}
                                        weight="bold"
                                    />
                                </Pressable>
                            </View>
                        ))}
                        <Pressable
                            onPress={pickPhotos}
                            disabled={pickDisabled}
                            accessibilityRole="button"
                            accessibilityLabel="Add More Photos"
                            style={({ pressed }) => ({
                                width: thumbSize,
                                height: thumbSize,
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                borderRadius: 12,
                                borderWidth: 1.5,
                                borderStyle: 'dashed',
                                borderColor: c.tint,
                                backgroundColor: pressed ? c.separator : c.surface,
                                opacity: pickDisabled ? 0.45 : 1,
                            })}
                        >
                            <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor={c.tint as string} size={22} />
                            <Text style={{ color: c.tint, fontSize: 13, fontWeight: '600' }}>Add More</Text>
                        </Pressable>
                    </ScrollView>
                )}
                <Text style={{ color: c.secondaryText, fontSize: 13, fontVariant: ['tabular-nums'] }}>
                    {`${photos.length} / ${MAX_PHOTOS} photos`}
                </Text>
            </View>

            {/* caption */}
            <View
                style={{
                    minHeight: 120,
                    padding: 14,
                    borderRadius: 14,
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: c.separator,
                    backgroundColor: c.surface,
                }}
            >
                <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
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
            <View style={{ gap: 12 }}>
                {error && (
                    <Text selectable style={{ color: c.danger, fontSize: 15, textAlign: 'center' }}>
                        {error}
                    </Text>
                )}
                <PillButton
                    label="Post"
                    onPress={submit}
                    loading={posting}
                    disabled={photos.length === 0}
                />
            </View>
        </ScrollView>
    )
}
