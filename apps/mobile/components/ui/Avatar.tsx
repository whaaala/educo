import { Image, StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
  imageUri?: string;
}

export function Avatar({ name, size = 40, imageUri }: AvatarProps) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.initial}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
  },
  initial: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
});


