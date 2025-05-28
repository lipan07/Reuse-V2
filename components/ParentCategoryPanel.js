import React, { memo } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const iconMapping = {
  electronics: 'television',
  fashion: 'tshirt-crew',
  furniture: 'sofa',
  cars: 'car',
  bikes: 'motorbike',
  mobiles: 'cellphone',
  properties: 'home',
  services: 'tools',
};

const ParentCategoryPanel = memo(({ categories, onSelectCategory, isLoading, isError, isRefreshing }) => {
  const rainbowColors = ['#FF0000', '#FF7F00', '#4B0082', '#00FF00', '#0000FF', '#FFFF00', '#9400D3'];

  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      underlayColor="#F0F0F0"
      style={styles.itemContainer}
      onPress={() => onSelectCategory(item)}
    >
      <View style={styles.itemContent}>
        <Icon
          name={iconMapping[item.guard_name] || 'tag'}
          size={24}
          color={rainbowColors[index % rainbowColors.length]}
          style={styles.icon}
        />
        <Text style={styles.itemText}>{item.name}</Text>
        <Icon
          name="chevron-right"
          size={20}
          color="#888888"
          style={styles.arrow}
        />
      </View>
    </TouchableHighlight>
  );


  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return <ActivityIndicator size="large" color="#4A90E2" style={styles.loadingIndicator} />;
  };

  return (
    <FlatList
      data={categories}
      renderItem={({ item, index }) => renderItem({ item, index })}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      ListFooterComponent={renderFooter}
      refreshing={isRefreshing}
      onRefresh={() => { }} // implement if needed
      ListEmptyComponent={
        !isLoading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isError ? 'Failed to load categories.' : 'No categories available'}
            </Text>
          </View>
        )
      }
    />

  );
});

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
  },
});

export default ParentCategoryPanel;