import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Keyboard, Platform, Dimensions } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { db } from '@/services/firebaseConfig';
import { ref, onValue, set, remove, onDisconnect  } from 'firebase/database';
import { useKeyboard } from '@/hooks/useKeyboard';

const { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } = Dimensions.get('window');
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
  const [canvasWidth, setCanvasWidth] = useState(CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(CANVAS_HEIGHT);
  const userPath = `usersCanvas`;
  const userRef = ref(db, `${userPath}/${user.uuid}`);

  // 取得位置資料
  useEffect(() => {
    const posRef = ref(db, `usersCanvas`);
    onValue(posRef, (snapshot) => {
      setPositions(snapshot.val() || {});
    });
  }, []);

  // 傳送自己的位置資料（不含訊息）
  const updateMyData = (data: any) => {
    if (!user?.uuid) return;
    set(ref(db, `usersCanvas/${user.uuid}`), {
      ...positions[user.uuid],
      ...data,
      uuid: user.uuid,
      username: user.username,
    });
  };

  // 初始位置
  useEffect(() => {
    if (!positions[user.uuid]) {
      updateMyData({ x: CANVAS_WIDTH / 3, y: CANVAS_HEIGHT / 2 });
    }
    onDisconnect(userRef).remove();
  }, [positions]);

  // 鍵盤控制方向 (Web)
  useEffect(() => {
    const handleKey = (e: any) => {
      const { x, y } = positions[user.uuid] || { x: CANVAS_WIDTH / 3, y: CANVAS_HEIGHT / 2 };
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
    <View 
      style={styles.container}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setCanvasWidth(width);
        setCanvasHeight(height);
      }}
    >
      <Svg height={canvasHeight} width={canvasWidth}>
      {[
        ...Object.values(positions).filter(p => p.uuid !== user.uuid),
        positions[user.uuid]
        ].map((item: any) => (
          item && (
            <React.Fragment key={item.uuid}>
              <Circle
                cx={item.x}
                cy={item.y}
                r={RADIUS}
                fill={getCharacter(item.uuid)}
              />
              <SvgText
                x={item.x}
                y={item.y - 30}
                fill="#fff"
                fontSize="12"
                textAnchor="middle"
              >
                {latestMessageMap[item.uuid] || ''}
              </SvgText>
              <SvgText
                x={item.x}
                y={item.y + 40}
                fill="#fff"
                fontSize="12"
                textAnchor="middle"
              >
                {item.username || ''}
              </SvgText>
            </React.Fragment>
          )
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
});
