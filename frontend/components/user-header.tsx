import { ThemedView } from './themed-view';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function UserHeader({
  userId,
  userLocation,
  userRating,
  itemId,
  displayName,
}: {
  userId: number;
  userLocation: string;
  userRating: number;
  itemId: number;
  displayName?: string;
}) {
  const colorScheme = useColorScheme() ?? 'light';
  const cardBg = colorScheme === 'dark' ? colours.container : 'rgba(0,0,0,0.16)';
  const avatarBg = colorScheme === 'dark' ? '#333333' : 'rgba(0,0,0,0.18)';
  const primaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#374151';
  const filledStarColor = '#FFD700';
  const emptyStarColor = colorScheme === 'dark' ? '#666' : '#9CA3AF';
  const starOutlineColor = colorScheme === 'dark' ? 'rgba(0,0,0,0.75)' : 'rgba(55,65,81,0.6)';

  const handleUserPress = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    console.log('User profile pressed', itemId);
  };

  const name = displayName ?? `User${userId}`;

  return (
    <ThemedView>
    <Pressable onPress={handleUserPress}>
    <ThemedView style={[styles.userProfileContainer, { backgroundColor: cardBg }]}>
      <ThemedView style={[styles.userProfileImage, { backgroundColor: avatarBg }]}>
        <ThemedText type="defaultSemiBold" style={{ color: primaryTextColor }}>{name.charAt(0).toUpperCase()}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.userMeta}>
        <ThemedText type="defaultSemiBold" style={{ color: primaryTextColor }}>{name}</ThemedText>
        <ThemedText type="defaultSemiBold" style={{ color: secondaryTextColor }}>{userLocation}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.userRating} accessibilityLabel={`Rating ${userRating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1;
          const filled = starIndex <= Math.round(userRating);
          return (
            <ThemedText
              key={starIndex}
              type="defaultSemiBold"
              style={{
                color: filled ? filledStarColor : emptyStarColor,
                marginHorizontal: 2,
                textShadowColor: filled ? starOutlineColor : 'transparent',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: filled ? 1.8 : 0,
              }}
            >
              {filled ? '★' : '☆'}
            </ThemedText>
          );
        })}
      </ThemedView>
    </ThemedView>
    </Pressable>
    </ThemedView>
  );
}

const colours = {
  container: '#25282B',
};



const styles = StyleSheet.create({
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 0,
    backgroundColor: colours.container,
    padding: 12,
    borderRadius: 16,
  },

  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userMeta: {
    backgroundColor: 'transparent',
    marginLeft: 12,
    flex: 1,
  },

  userRating: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
