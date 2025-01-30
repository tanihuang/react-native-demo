import React, { forwardRef, useState, useRef, useEffect } from "react";
import { 
  StyleSheet,
  Image,
  Platform,
  TextInput,
  Pressable,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import store from '@/store/index';
import Icon from 'react-native-vector-icons/FontAwesome';
import useChatRoom from '@/services/websocket/chatRoom/useChatRoom';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchVisible, setSearchItem, setSearchResult, clearSearch } from '@/store/chatRoomSlice';
import { useHeaderHeight } from '@react-navigation/elements';
import Default from '@/constants/Default';

export default function ChatRoomSearch() {
  const user = useSelector((state: any) => state.user);
  const { searchVisible, searchResult } = useSelector((state: any) => state.chatroom);
  const [search, setSearch] = useState('');
  const { createChatRoom } = useChatRoom({});

  const textInputRef = useRef(null);
  const flatListRef = useRef(null);

  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const handleSubmitEditing = async (value: string) => {

    if (!value.trim()) {
      dispatch(clearSearch());
      return;
    }
    try {
      const response: any = await axios.get(`${Default.userByUsername({ value1: value })}`);
      dispatch(setSearchResult({ data: response.data, user }));
      dispatch(setSearchVisible(true));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOnPress = (item: any, groupType = 0) => {
    dispatch(setSearchItem(item));
    createChatRoom(item, groupType);
    handleOnClose();
  };

  const handleOnClose = () => {
    setSearch('');
    dispatch(clearSearch());
  };

  const renderFlatListItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.flatListItem}
      onPress={() => handleOnPress(item)}
    >
      <Text>{item.username}</Text>
    </TouchableOpacity>
  );

  return(
    <View style={styles.container}>
      <Icon name="search" size={12} color="#888" style={styles.icon} />
      <TextInput
        value={search}
        placeholder='Search'
        clearButtonMode='always'
        onChangeText={(value: any) => setSearch(value)}
        onSubmitEditing={(e: any) => handleSubmitEditing(e.target.value)}
        // onBlur={(e) => handleOnClose(e)}
        blurOnSubmit={false}
        style={styles.textInput}
        placeholderTextColor='#888'
      />
      {searchVisible && searchResult && searchResult.length > 0 && (
        <FlatList
          data={searchResult}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFlatListItem}
          style={styles.flatListContainer}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    maxWidth: 300,
    position: 'relative',
    marginHorizontal: 'auto',
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: '-50%' }],
    color: '#888',
    pointerEvents: 'none',
  },
  textInput: {
    backgroundColor: '#eee',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 35,
    paddingRight: 5,
    width: '100%',
    borderRadius: 5,
    textAlign: 'left',
    height: 35,
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  flatListContainer: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
    position: 'absolute',
    top: '100%',
    left: 0,
  },
  flatListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
