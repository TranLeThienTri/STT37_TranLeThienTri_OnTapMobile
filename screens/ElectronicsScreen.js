import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import Footer from '../components/Footer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Dots from 'react-native-dots-pagination'; 
import { useNavigation } from '@react-navigation/native';

export default function ElectronicsScreen() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('Best Sales');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeDot, setActiveDot] = useState(0); 
  const navigation = useNavigation();
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('https://671168cf4eca2acdb5f4c2fe.mockapi.io/categoriesOfElectronic');
        const productsResponse = await axios.get('https://671168cf4eca2acdb5f4c2fe.mockapi.io/productsOfElectronics');
        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);  // Set initial filteredProducts
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter products based on selected category
  const filterProducts = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    const filtered = products.filter(product => product.name === categoryName);
    setFilteredProducts(filtered);
  };

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <ScrollView style={{ width: "100%", height: 500 }}>

        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000"/>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Electronics</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={30} color="#9095a0"/>
          </TouchableOpacity>

          <Image source={require('../assets/img/ava1.png')} style={styles.profileImage}/>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, searchFocused && styles.inputContainerFocused]}>
            <MaterialIcons name="search" size={20} color="#aaa" style={styles.searchIcon}/>
            <TextInput 
              placeholder="Search" 
              style={styles.searchInput} 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </View>
          <TouchableOpacity style={styles.sortButton}>
            <MaterialIcons name="sort" size={20} color="#000"/>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => filterProducts(category.id, category.name)}
              style={[styles.categoryContainer,
                category.id === "1" && { backgroundColor: '#D8BFD8' },
                category.id === "2" && { backgroundColor: '#ADD8E6' },
                category.id === "3" && { backgroundColor: '#FFE4B5' },
                { borderColor: selectedCategoryId === category.id ? 
                  (category.id === "1" ? '#c478f0' : category.id === "2" ? '#81a7de' : '#fccd7c') : 'transparent' }
              ]}
            >
              <Image
                source={{ uri: category.icon }}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabs}>
          {['Best Sales', 'Best Matched', 'Popular'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={showAllProducts ? filteredProducts : filteredProducts.slice(0, 4)} 
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Image
                  source={require('../assets/Data/Rating.png')}
                  style={styles.ratingImage}
                />
              </View>

              <View style={styles.priceAndButton}>
                <TouchableOpacity style={styles.addToCartButton}>
                  <MaterialIcons name="add" size={20} color="#fff"/>
                </TouchableOpacity>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.productList}
        />

        <TouchableOpacity style={styles.seeAllButton} onPress={toggleShowAllProducts}>
          <Text style={styles.seeAllButtonText}>{showAllProducts ? 'See less' : 'See all'}</Text>
        </TouchableOpacity>

        <View style={styles.staticImageContainer}>
          <Image source={require('../assets/Data/banner.png')} style={styles.staticImage} />
        </View>

        <View style={styles.paginationDots}>
          <Dots
            length={4} 
            active={activeDot} 
            activeColor="#00A8E8"
            passiveColor="#ccc"
            passiveDotWidth={8} 
            activeDotWidth={22} 
            passiveDotHeight={8} 
          />
        </View>
      </ScrollView>

      <Footer/>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    marginLeft: '-3%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 10,
  },
  cartButton: {
    marginLeft: 10,
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  inputContainerFocused: {
    borderColor: '#1f1f1f',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: 'transparent',
    outlineWidth: 0,
    flex: 1, 
  },
  sortButton: {
    width: 40,
    height: 40,
    padding: 10, 
    marginLeft: 12, 
    borderRadius: 10,
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00A8E8',
    fontWeight: '600',
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryContainer: {
    alignItems: 'center',
    width: 105,
    height: 92,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: 2,
  },
  categoryIcon: {
    width: 76,
    height: 68,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#aaa',
  },
  activeTabText: {
    color: '#00A8E8',
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingImage: {
    width: 70,
    height: 14,
    marginTop: 14,
  },
  priceAndButton: {
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  addToCartButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00A8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllButton: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#d9d8d7',
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  seeAllButtonText: {
    fontSize: 16,
    color: '#565e6c',
    fontWeight: '500',
  },
  staticImageContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  staticImage: {
    width: 370,
    height: 128,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  paginationDots: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
