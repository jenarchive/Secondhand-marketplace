import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Dimensions, Modal, FlatList, Animated } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/themed-text';
import { useState, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';

// dimension variables
const screenWidth = Dimensions.get('window').width;
const padding = 32;
const gapSize = 8;
const columns = 3;

const gapSpace = gapSize * (columns - 1);
const availableSpace = screenWidth - padding - gapSpace - 64;
const photoSize = Math.floor(availableSpace / columns);

// list of options for the category input
const categories = [
  { id: '1', name: 'Clothing' },
  { id: '2', name: 'Electronics' },
  { id: '3', name: 'Home' },
  { id: '4', name: 'Entertainment' },
  { id: '5', name: 'Sports' },
  { id: '6', name: 'Collectables' },
  { id: '7', name: 'Other' },
]

export default function HomeScreen() {
  // form variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState({});
  
  // image functions
  const pickImage = async () => {
    if (images.length >= 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - images.length,
      // preferredAssetRepresentationMode: ImagePicker.AssetRepresentationMode.Compatible,
      // quality: 1,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      const uniqueNewUris = newUris.filter(uri => !images.includes(uri));

      if (uniqueNewUris.length === 0 && newUris.length > 0) {
        alert('At least one of these photos has already been selected');
        return;
      }

      setImages([...images, ...newUris]);

      if (errors.images) setErrors({...errors, images: false});
    }
  };

  const removeImage = (removeIndex: number) => {
    setImages(images.filter((_, index) => index !== removeIndex));
  };

  // category animation
  
  const slideAnimation = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimation, {
        toValue: Dimensions.get('window').height,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  // handle upload functions
  
  const decideBorderColour = (field) => {
    if (focusedInput === field) return '#007AFF80';
    if (errors[field]) return '#FF000080';
    return '#444';
  }

  const handleUpload = async () => {
    let newErrors = {};
    let valid = true;

    if (!title.trim()) { newErrors.title = true; valid = false; }
    if (!description.trim()) { newErrors.description = true; valid = false; }
    if (!price.trim()) { newErrors.price = true; valid = false; }
    if (!category) { newErrors.category = true; valid = false; }
    if (images.length === 0) { newErrors.images = true; valid = false; }
    
    setErrors(newErrors);

    if (valid) {
      try {
        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', categories.find(c => c.name === category));

        images.forEach((uri, index) => {
          formData.append('images', {
            uri: uri,
            name: `${index}.jpg`,
            type: 'image/jpeg'
          } as any);
        });

        const response = await fetch('http://192.168.0.43:5000/api/items', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("successfully uploaded item: ", result.item_id);

          router.back();
        } else {
          alert("upload failed: " + result.error);
        }

      } catch (error) {
        alert("error: " + error);
      }
    }
  }

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
              { borderColor: decideBorderColour('title') }
              // focusedInput === 'title' && { borderColor: '#007AFF80', borderWidth: 2 }
            ]}
            onFocus={() => {
              setFocusedInput('title');
              if (errors.title) setErrors({...errors, title: false});
            }}
            onBlur={() => setFocusedInput(null)}
            value={title}
            onChangeText={setTitle}
            placeholder="What is your item"
          />

          <ThemedText type="subtitle" style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              { borderColor: decideBorderColour('description') }
            ]}
            onFocus={() => {
              setFocusedInput('description')
              if (errors.description) setErrors({...errors, description: false});
            }}
            onBlur={() => setFocusedInput(null)}
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Describe more about your item"
          />

          <ThemedText type="subtitle" style={styles.label}>Price (£)</ThemedText>
          <TextInput
            style={[
              styles.input,
              { borderColor: decideBorderColour('price') }
            ]}
            onFocus={() => {
              setFocusedInput('price')
              if (errors.price) setErrors({...errors, price: false});
            }}
            onBlur={() => setFocusedInput(null)}
            value={price}
            onChangeText={(text) => {
              // only allow numbers and 2 decimal points
              if (/^\d*\.?\d{0,2}$/.test(text)) {
                setPrice(text);
              }
            }}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="0.00"
            keyboardType="numeric"
          />

          <ThemedText type="subtitle" style={styles.label}>Category</ThemedText>
          <TouchableOpacity
            style={[styles.input, styles.selectorButton, { borderColor: decideBorderColour('category') }]}
            onPress={() => {
              if (errors.category) setErrors({...errors, category: false});
              openModal();
            }}
          >
            <ThemedText style={category ? styles.selectorText : styles.placeholderText}>
              {category || "Select a Category"}
            </ThemedText>
          </TouchableOpacity>

          <View style={{ gap: 12 }}>
            <ThemedText type="subtitle">Photos ({images.length}/5)</ThemedText>

            <View style={styles.imageGrid}>

              {images.length < 5 && (
                <TouchableOpacity onPress={pickImage} style={[
                  styles.imagePickerButton,
                  errors.images ? {
                    borderColor: '#FF000080',
                    borderStyle: 'solid',
                    borderWidth: 2
                  } : {
                    borderColor: '#444',
                    borderStyle: 'dashed',
                    borderWidth: 1
                  }
                ]}>
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

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
          >
            <ThemedText style={styles.uploadButtonText}>Upload</ThemedText>
          </TouchableOpacity>

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

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >

        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnimation }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} />
          </Animated.View>
          
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnimation }] }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Select Category</ThemedText>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.categoryOption}
                  onPress={() => {
                    setCategory(item.name);
                    if (errors.category) setErrors({...errors, category: false});
                    closeModal();
                  }}
                >
                  <ThemedText style={styles.categoryText}>{item.name}</ThemedText>
                  {category === item.name && (
                    <Ionicons name="checkmark" size={20} color="#0A84FF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
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
  // form styles
  formContainer: {
    padding: 16,
    gap: 16,
    marginTop: 100,
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
  // photo upload
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
  // category selector
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    color: 'white',
    fontSize: 16,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
    marginTop: 'auto',
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 16,
    color: 'white',
  },
  // upload button
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
