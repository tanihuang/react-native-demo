import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { openBlank } from '@/utils/utils';
import { Ai } from '@/constants/Ai';

const Stack = createNativeStackNavigator();

function DrawerContent() {
  const [activeModule, setActiveModule] = useState(Ai [0]);
  const navigation: any = useNavigation();

  return (
    <View style={styles.container}>
      {/* 上方模組展示區 */}
      <View style={styles.panel}>
        <Text style={styles.title}>{activeModule.title}</Text>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={styles.description}>{activeModule.description}</Text>
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openBlank(activeModule.path)}
        >
          <Text style={styles.buttonText}>Demo</Text>
        </TouchableOpacity>
      </View>

      {/* 下方模組清單 FlatList */}
      <View>
        <FlatList
          data={Ai}
          keyExtractor={(item) => item.key}
          numColumns={3}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item, index }) => {
            const isActive = activeModule.key === item.key;
            const col = index % 3;
            return (
              <TouchableOpacity
                onPress={() => setActiveModule(item)}
                style={[
                  styles.tabItem,
                  isActive && styles.tabItemActive,
                ]}
              >
                <Ionicons name={item.icon as any} size={20} color="#fff" />
                <Text style={styles.tabText}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

export default function AiModulesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ai" component={DrawerContent} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(32, 37, 64)',
  },
  panel: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    height: 64,
    display: 'flex',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 16,
    backgroundColor: 'rgb(32, 37, 64)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  columnWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tabItem: {
    width: '31.5%',
    height: 76,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
  },
  tabItemActive: {
    backgroundColor: 'rgb(84, 92, 143)',
  },
  tabText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    backgroundColor: 'rgb(88, 130, 247)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
