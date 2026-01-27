import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

// dimension variables
const screenWidth = Dimensions.get('window').width;
const padding = 32;
const gapSize = 8;
const columns = 3;

const gapSpace = gapSize * (columns - 1);
const availableSpace = screenWidth - padding - gapSpace;
const photoSize = availableSpace / columns;

export default function HomeScreen() {
  // form variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [images, setImages] = useState<string[]>([]);
  
  // image functions
  const pickImage = async () => {
    if (images.length >= 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimits: 5 - images.length,
      quality: 1,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setImages([...images, ...newUris]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, index) => index !== index));
  }; 

  return (
    <View style={styles.container}>

      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image/>
        }>
        
        <View style={styles.formContainer}>
          <ThemedText type="subtitle" style={styles.label}>Title</ThemedText>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'title' && { borderColor: '#007AFF80', borderWidth: 2 }
            ]}
            onFocus={() => setFocusedInput('title')}
            onBlur={() => setFocusedInput(null)}
            value={title}
            onChangeText={setTitle}
          />

          <ThemedText type="subtitle" style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'description' && { borderColor: '#007AFF80', borderWidth: 2 }
            ]}
            onFocus={() => setFocusedInput('description')}
            onBlur={() => setFocusedInput(null)}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <ThemedText type="subtitle" style={styles.label}>Price (£)</ThemedText>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'price' && { borderColor: '#007AFF80', borderWidth: 2 }
            ]}
            onFocus={() => setFocusedInput('price')}
            onBlur={() => setFocusedInput(null)}
            value={price}
            onChangeText={(text) => {
              // only allow numbers and 2 decimal points
              if (/^\d*\.?d{0,2}$/.test(text)) {
                setPrice(text);
              }
            }}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={{ gap: 12 }}>
            <ThemedText type="subtitle">Photos ({images.length}/5)</ThemedText>

            <View style={styles.imageGrid}>

              {images.length < 5 && (
                <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                  <Ionicons name="camera-outline" size={30} color="#888" />
                  <ThemedText style={{ color: '#888', fontSize: 12 }}>Add</ThemedText>
                </TouchableOpacity>
              )}

              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  {/* Little 'x' button to remove image */}
                  <TouchableOpacity 
                    onPress={() => removeImage(index)} 
                    style={styles.removeImageButton}
                  >
                    <Ionicons name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

            </View>

          </View>

        </View>

      </ParallaxScrollView>
      
      {/* header */}
      <View style={styles.header}>
        {/* back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {/* title */}
        <ThemedText type="title" style={styles.pageTitle}>Sell an item</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
    paddingBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 8,
    padding: 4,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  pageTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  formContainer: {
    padding: 16,
    gap: 16,
    marginTop: 110,
  },
  input: {
    backgroundColor: '#333333',
    color: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#444',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gapSize,
  },
  imagePickerButton: {
    width: photoSize,
    height: photoSize,
    backgroundColor: '#333333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  imageWrapper: {
    width: photoSize,
    height: photoSize,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'white',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogr: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  }
});
