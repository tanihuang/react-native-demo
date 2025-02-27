import React, { useEffect } from 'react';
import { 
  View, 
  Image, 
  Text, 
  StyleSheet, 
  Platform, 
  FlatList, 
  SectionList, 
  Pressable, 
  useColorScheme, 
  useWindowDimensions 
} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabHome() {
  const colorScheme = useColorScheme();
  const { width, height, fontScale } = useWindowDimensions();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [menuList, setMenuList] = React.useState([]);
  const renderTitle = () => <Text style={styles.imageTitle}>View Menu</Text>
  const renderFlatList: any[] = [ 
    { name: 'item1', price: '$5.00', url: require('@/assets/images/item1.jpeg') },
    { name: 'item2', price: '$10.00', url: require('@/assets/images/item1.jpeg') }
  ];
  const renderSectionList: any[] = [ 
    { 
      title: 'Sectionn1', 
      data: [
        { name: 'item1', price: '$5.00', url: require('@/assets/images/item1.jpeg') },
        { name: 'item2', price: '$10.00', url: require('@/assets/images/item1.jpeg') }
      ] 
    }
  ];
  const renderItem = ({ item }: any) => (
    <View>
      <Image
        resizeMode='cover'
        source={item.url}
        style={styles.imageItem}
        accessible={true}
        accessibilityLabel={item.name}
      />
      <View style={styles.imageTextBox}>
        <Text style={styles.imageText}>{item.name}</Text>
        <Text style={styles.imageText}>{item.price}</Text>
      </View>
    </View>
  );
  const renderMenuItem = ({ item }: any) => (
    <View>
      {/* <Image
        resizeMode='cover'
        source={item.url}
        style={styles.imageItem}
        accessible={true}
        accessibilityLabel={item.name}
      /> */}
      <View style={styles.imageTextBox}>
        <Text style={styles.imageText}>{item.title}</Text>
        <Text style={styles.imageText}>{item.price}</Text>
      </View>
    </View>
  );
  const separator = () => <View style={styles.separator}></View>

  const requestList = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/littleLemonSimpleMenu.json'
      );
      const json = await response.json();
      setMenuList(json.menu);
    } catch {
      // eslint-disable-next-line no-empty
    }
  };

  useEffect(() => {
    requestList();
  }, [])

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView 
          style={[
            styles.titleContainer, 
            { backgroundColor: colorScheme === 'light' ? '#fff' : '#333333' }
          ]}
        >
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
            useWindowDimensions <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
            Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
            </ThemedText>{' '}
            to open developer tools.
            width: {width}
            height: {height}
            fontScale: {fontScale}
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      {/* <FlatList 
        keyExtractor={(item, index) => index.toString()} 
        data={renderFlatList} 
        renderItem={renderItem}
        ItemSeparatorComponent={separator}
        ListHeaderComponent={renderTitle}
        ListFooterComponent={<Text>This is footer</Text>}
      /> */}
      {menuVisible && (
        <FlatList 
          keyExtractor={(item, index) => index.toString()} 
          data={menuList} 
          renderItem={renderMenuItem}
          ItemSeparatorComponent={separator}
          ListHeaderComponent={renderTitle}
          ListFooterComponent={<Text style={{ textAlign: 'center', paddingVertical: 10 }}>This is footer</Text>}
        />
      )}
      {/* {menuVisible && (
        <SectionList 
          keyExtractor={(item, index) => index.toString()} 
          sections={renderSectionList}
          renderItem={renderItem}
          // renderSectionHeader={renderTitle}
        />
      )} */}
      <Pressable
        style={styles.submitButton}
        onPress={() => {
          setMenuVisible(!menuVisible)
        }}
      >
        <Text style={styles.submitButtonText}>{ menuVisible ? 'Close Menu' : 'Open Menu' }</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  imageTextBox: {
    marginVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageItem: {
    height: 220,
  },
  imageTitle: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
  },
  imageText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: 'yellow',
  },
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
  }
});
