// CategoryMenu.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const scale = width / 375;
const normalize = (size) => Math.round(scale * size);

const CategoryMenu = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    { id: null, name: 'All', icon: 'apps', color: '#007bff' },
    { id: '1', name: 'Cars', icon: 'car', color: '#6495ED' },
    { id: '2', name: 'Property', icon: 'home', color: '#4682B4' },
    { id: '7', name: 'Phones', icon: 'phone-portrait', color: '#32CD32' },
    { id: '29', name: 'Tech', icon: 'tv', color: '#FFD700' },
    { id: '24', name: 'Bikes', icon: 'bicycle', color: '#D2691E' },
    { id: '45', name: 'Furniture', icon: 'bed', color: '#8A2BE2' },
    { id: '51', name: 'Fashion', icon: 'shirt', color: '#FF69B4' },
    { id: '55', name: 'Books', icon: 'book', color: '#FF6347' },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      < TouchableOpacity
        style={
          [
            styles.categoryItem,
            isSelected && styles.selectedItem
          ]}
        onPress={() => onCategorySelect(item.id)}
      >
        <View style={[
          styles.iconContainer,
          isSelected && styles.selectedIconContainer
        ]}>
          <Icon
            name={item.icon}
            size={normalize(28)}
            color={isSelected ? '#007bff' : item.color}
          />
        </View>
        <Text style={[
          styles.categoryName,
          isSelected && styles.selectedText
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity >
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || 'all'}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // paddingVertical: normalize(16),
    paddingHorizontal: normalize(4),
  },
  title: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#666',
    marginBottom: normalize(12),
    paddingHorizontal: normalize(8),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  listContent: {
    paddingHorizontal: normalize(4),
  },
  categoryItem: {
    width: normalize(72), // or any fixed width you prefer
    alignItems: 'center',
    padding: normalize(4),
    borderRadius: normalize(12),
    backgroundColor: '#f8f9fa',
    marginRight: normalize(8), // add spacing between items
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: normalize(8),
    borderRadius: normalize(10),
    marginBottom: normalize(6),
  },
  selectedIconContainer: {
    backgroundColor: '#fff',
  },
  categoryName: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: '#57606f',
    textAlign: 'center',
  },
  selectedText: {
    color: '#007bff',
    fontWeight: '600',
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
    borderWidth: 1,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default CategoryMenu;