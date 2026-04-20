import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { ThemedView } from './themed-view';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import * as Haptics from 'expo-haptics';
import TestData from '@/test-data.json'
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
  const cardBg = colorScheme === 'dark' ? colours.container : 'rgba(0,0,0,0.12)';
  const avatarBg = colorScheme === 'dark' ? '#333333' : 'rgba(0,0,0,0.14)';
  const primaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#374151';
  const emptyStarColor = colorScheme === 'dark' ? '#666' : '#9CA3AF';

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
              style={{ color: filled ? '#FFD700' : emptyStarColor, marginHorizontal: 2 }}
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
  button: '#28289D'
};



const styles = StyleSheet.create({
  listingContainer: {
    gap: 15, 
    marginBottom: 80
  },

  listingTitle: {
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: colours.container,
    borderRadius: 16
  },

  listingLink: {
    width: '48%',
    textDecorationLine: 'none',
    marginBottom: 16
  },

  image: {
    width: '100%',
    borderRadius: 16,
    aspectRatio: 1
  },

  //wraps children into two columns
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  descriptionText: {
    textOverflow: "ellipsis",
    overflow: "hidden"
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: colours.container,
  },

  listingDescription: {
    gap: 16,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: colours.container,
    borderRadius: 16
  },

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
  }
 ,
  floatingContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 'auto',
    alignItems: 'center',
    zIndex: 1000,
  },

  buyButton: {
    backgroundColor: colours.button,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 15,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },

  offerButton: {
    backgroundColor: colours.button,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',

  }
});
