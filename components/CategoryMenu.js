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
    { id: '1', name: 'Cars', icon: 'car', color: '#64748b' },
    { id: '2', name: 'Property', icon: 'home', color: '#ef4444' },
    { id: '7', name: 'Phones', icon: 'phone-portrait', color: '#10b981' },
    { id: '29', name: 'Tech', icon: 'tv', color: '#f59e0b' },
    { id: '24', name: 'Bikes', icon: 'bicycle', color: '#3b82f6' },
    { id: '45', name: 'Furniture', icon: 'bed', color: '#8b5cf6' },
    { id: '51', name: 'Fashion', icon: 'shirt', color: '#ec4899' },
    { id: '55', name: 'Books', icon: 'book', color: '#14b8a6' },
  ];

  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[
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
            size={normalize(25)}
            color={isSelected ? '#ffffff' : item.color}
          />
        </View>
        <Text style={[
          styles.categoryName,
          isSelected && styles.selectedText
        ]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || 'all'}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: normalize(8),
  },
  listContent: {
    paddingHorizontal: normalize(12),
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: normalize(16),
  },
  iconContainer: {
    backgroundColor: '#f8fafc',
    padding: normalize(12),
    borderRadius: normalize(12),
    marginBottom: normalize(4),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedIconContainer: {
    backgroundColor: '#007bff',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    fontSize: normalize(11),
    fontWeight: '500',
    color: '#64748b',
    maxWidth: normalize(80),
  },
  selectedText: {
    color: '#007bff',
    fontWeight: '600',
  },
    selectedItem: {
    // borderWidth: 0.5,  // Thinner border
    // shadowRadius: 2,  // Reduced shadow
    // elevation: 2,  // Reduced elevation
  },
});

export default CategoryMenu;