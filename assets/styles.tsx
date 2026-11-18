// File: styles.tsx
// Author: Matthew Hepburn (mhepburn@bu.edu), 11/18/2026
// Description: shared styled components (Avatar, PillButton, FittedImage, ProfileHeader, etc.) for MiniInsta

// Shared styled components for MiniInsta. Colors come from constants/Colors via useColors.
import { useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
  type ColorValue,
  type ImageStyle,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Link, type Href } from 'expo-router';
import { useColors } from '@/components/Themed';

// ---- Avatar: round profile photo inside the blue/yellow ring ----

type AvatarProps = {
  uri: string;
  size: number;
  /** Fill between the photo and the ring; should match what the avatar sits on. */
  gapColor?: ColorValue;
};

export function Avatar({ uri, size, gapColor }: AvatarProps) {
  const c = useColors();
  const ring = size >= 80 ? 4 : 2.5;
  const gap = size >= 80 ? 3 : 2;

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: ring,
        borderRadius: size / 2,
        experimental_backgroundImage: `linear-gradient(135deg, ${c.sky} 0%, ${c.sun} 50%, ${c.sky} 100%)`,
      }}
    >
      <View style={{ flex: 1, padding: gap, borderRadius: size / 2, backgroundColor: gapColor ?? c.background }}>
        <Image
          source={{ uri }}
          style={{ flex: 1, borderRadius: size / 2, backgroundColor: c.surface }}
        />
      </View>
    </View>
  );
}

// ---- Tappable: Pressable that dims while pressed; plain style so it works under <Link asChild> ----

type TappableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
};

export function Tappable({ style, pressedOpacity = 0.6, ...props }: TappableProps) {
  return <Pressable {...props} style={({ pressed }) => [style, pressed && { opacity: pressedOpacity }]} />;
}

// ---- PillButton: capsule button. primary = pale yellow, secondary = blue outline ----

type PillButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  /** Shows a spinner in place of the label. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PillButton({ label, onPress, variant = 'primary', disabled, loading, style }: PillButtonProps) {
  const c = useColors();
  const primary = variant === 'primary';
  const fg = primary ? c.onSun : c.tint;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        {
          height: 48,
          paddingHorizontal: 28,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: primary ? (pressed ? c.sunPressed : c.sun) : pressed ? c.surface : 'transparent',
          borderWidth: primary ? 0 : 1.5,
          borderColor: c.tint,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={{ color: fg, fontSize: 16, fontWeight: '600' }}>{label}</Text>
      )}
    </Pressable>
  );
}

// ---- FittedImage: full-width image at the photo's own proportions, ratio clamped ----

type FittedImageProps = {
  uri: string;
  /** Narrowest allowed width / height. */
  minRatio?: number;
  /** Widest allowed width / height. */
  maxRatio?: number;
  resizeMode?: 'cover' | 'contain';
  style?: StyleProp<ImageStyle>;
};

export function FittedImage({ uri, minRatio = 0.8, maxRatio = 1.91, resizeMode = 'cover', style }: FittedImageProps) {
  const c = useColors();
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    Image.getSize(uri)
      .then(({ width, height }) => {
        if (active && width > 0 && height > 0) setRatio(width / height);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [uri]);

  const aspectRatio = Math.min(maxRatio, Math.max(minRatio, ratio ?? 1));

  return (
    <Image
      source={{ uri }}
      resizeMode={resizeMode}
      style={[{ width: '100%', aspectRatio, backgroundColor: c.surface }, style]}
    />
  );
}

// ---- Centered: full-screen centered container for spinners and messages ----

export function Centered({ children }: { children: ReactNode }) {
  const c = useColors();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: c.background }}>
      {children}
    </View>
  );
}

export function MessageText({ children }: { children: ReactNode }) {
  const c = useColors();
  return (
    <Text selectable style={{ color: c.secondaryText, fontSize: 16, lineHeight: 22, textAlign: 'center' }}>
      {children}
    </Text>
  );
}

// ---- ProfileHeader: avatar, name and handle, with optional content below ----

type ProfileHeaderProps = {
  photo: string;
  name: string;
  username: string;
  /** Anything that sits under the name row, such as a button. */
  children?: ReactNode;
};

export function ProfileHeader({ photo, name, username, children }: ProfileHeaderProps) {
  const c = useColors();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <Avatar uri={photo} size={96} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text selectable style={{ color: c.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 }}>
            {name}
          </Text>
          <Text selectable style={{ color: c.tint, fontSize: 16 }}>
            @{username}
          </Text>
        </View>
      </View>
      {children}
    </View>
  );
}

// ---- GridTile: one square thumbnail in the 3-column post grid ----

export function GridTile({ href, photo }: { href: Href; photo: string }) {
  const c = useColors();
  return (
    <Link href={href} asChild>
      <Tappable pressedOpacity={0.75} style={{ width: '33.333%', aspectRatio: 1, padding: 1 }}>
        <Image source={{ uri: photo }} style={{ flex: 1, backgroundColor: c.surface }} />
      </Tappable>
    </Link>
  );
}
