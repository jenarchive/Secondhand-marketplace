import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMyListings } from '@/contexts/MyListingsContext';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string; sellerName?: string; transactionMethod?: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const { items } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const backButtonBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const headerTitle = params.sellerName ?? `User${params.id}`;
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const showPostage = params.transactionMethod === 'Delivery';
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const inputBarBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#999';
  const inputBarPadding = Math.max(insets.bottom, 12) + 12;

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: send message
    setMessage('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: backButtonBg }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
            {headerTitle}
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.contentWrap}>
            <View style={styles.content}>
            {itemData && (
              <>
                <View style={styles.productRow}>
                  <Image
                    source={{ uri: itemData.image }}
                    style={styles.productImage}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                  />
                  <View style={styles.productBody}>
                    <Text style={[styles.productTitle, { color: '#FFFFFF' }]} numberOfLines={2}>
                      {itemData.title}
                    </Text>
                    <Text style={[styles.productPrice, { color: '#FFFFFF' }]}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(itemData.price)}
                    </Text>
                    {showPostage && (
                      <Text style={[styles.productPostage, { color: unselectedTextColor }]}>
                        Postage £2.50
                      </Text>
                    )}
                  </View>
                </View>

                <Pressable
                  style={[styles.viewDetailsButton, { backgroundColor: borderColor }]}
                  onPress={() => router.push({ pathname: `/items/${id}`, params: { fromChat: 'true' } })}
                >
                  <Text style={styles.viewDetailsButtonText}>View details</Text>
                </Pressable>
              </>
            )}
          </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.bottomWrap}>
          <View style={[styles.inputBar, { backgroundColor: inputBarBg, paddingBottom: inputBarPadding, paddingTop: 12 }]}>
            <View style={[styles.moreButton, { backgroundColor: backButtonBg }]}>
              <Ionicons name="add" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </View>
            <TextInput
              style={[styles.messageInput, { color: '#FFFFFF' }]}
              placeholder="Enter your message."
              placeholderTextColor={placeholderColor}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[styles.sendButton, { backgroundColor: message.trim() ? borderColor : backButtonBg }]}
              onPress={handleSend}
            >
              <Ionicons name="arrow-up" size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  backButton: {
    padding: 4,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  contentWrap: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100 + 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  productBody: {
    flex: 1,
    minWidth: 0,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  productPostage: {
    fontSize: 13,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  viewDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
    zIndex: 300,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomWrap: {
    zIndex: 300,
  },
});
