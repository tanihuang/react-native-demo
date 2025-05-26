import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { db } from '@/services/firebaseConfig';
import { ref, onValue, set, onDisconnect, off } from 'firebase/database';
import { Default } from '@/constants/ChatRoom';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const RADIUS = 24;
const SPEED = 10;

function getCharacter(uuid: string): string {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash >> 0) & 255;
  const g = (hash >> 8) & 255;
  const b = (hash >> 16) & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

export default function ChatRoomCanvas({ user, chat }: any) {
  const [positions, setPositions] = useState<Record<string, any>>({});
  const userRef = ref(db, `${Default.users.usersCanvas}/${user.uuid}`);

  useEffect(() => {
    const posRef = ref(db, Default.users.usersCanvas);
    onValue(posRef, (snapshot) => {
      setPositions(snapshot.val() || {});
    });
    return () => off(posRef);
  }, [user.isLogged]);

  const updateMyData = (data: any) => {
    if (!user?.uuid) return;
    set(userRef, {
      ...positions[user.uuid],
      ...data,
      uuid: user.uuid,
      username: user.username,
    });
  };

  useEffect(() => {
    if (!positions[user.uuid]) {
      updateMyData({ x: SCREEN_WIDTH / 3, y: SCREEN_HEIGHT / 2 });
    }
    onDisconnect(userRef).remove();
  }, [positions]);

  useEffect(() => {
    const handleKey = (e: any) => {
      const { x, y } = positions[user.uuid] || { x: SCREEN_WIDTH / 3, y: SCREEN_HEIGHT / 2 };
      if (!x && !y) return;
      if (e.key === 'ArrowUp') updateMyData({ x, y: y - SPEED });
      if (e.key === 'ArrowDown') updateMyData({ x, y: y + SPEED });
      if (e.key === 'ArrowLeft') updateMyData({ x: x - SPEED, y });
      if (e.key === 'ArrowRight') updateMyData({ x: x + SPEED, y });
    };
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [positions]);

  const latestMessageMap = chat.reduce((acc: Record<string, string>, item: any) => {
    if (item?.user?.uuid && item?.content) acc[item.user.uuid] = item.content;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {Object.values(positions).map((item: any) => {
        if (!item) return null;
        const message = latestMessageMap[item.uuid];
        const backgroundColor = getCharacter(item.uuid);
        const isMe = item.uuid === user.uuid;

        return (
          <View
            key={item.uuid}
            style={[styles.userContainer, {
              left: item.x - RADIUS,
              top: item.y - RADIUS,
              zIndex: isMe ? 1 : 0,
            }]}
          >
            {message && (
              <View style={styles.messageBubbleWrapper}>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>{message}</Text>
                </View>
                <View style={styles.triangle} />
              </View>
            )}
            <View style={[styles.circle, { backgroundColor }]} />
            <Text style={styles.username}>{item.username || ''}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  userContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  circle: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS,
  },
  username: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  messageBubbleWrapper: {
    alignItems: 'center',
    marginBottom: 2,
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    maxWidth: 100,
  },
  messageText: {
    color: '#000',
    fontSize: 12,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopColor: '#fff',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
