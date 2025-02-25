import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Dialog from 'react-native-dialog';
import { message } from 'antd';

export let showAlert: (type?: string, content?: string) => void = () => {
  console.warn('⚠️ showAlert is not yet initialized');
};

const AlertDialog = () => {
  const [state, setState] = useState({
    visible: false,
    content: '',
  });

  useEffect(() => {
    showAlert = (type = 'success', content) => {
      if (!content) [type, content] = ['success', type];
      if (Platform.OS === 'web') {
        (message as any)[type]({
          content,
          duration: 3,
        });
      } else {
        setState({ visible: true, content });
      }
    };
  }, []);

  const hideAlert = () => setState((prev) => ({ ...prev, visible: false }));

  return (
    <>
      {Platform.OS !== 'web' && (
        <Dialog.Container visible={state.visible}>
          <Dialog.Description>{state.content}</Dialog.Description>
          <Dialog.Button label="OK" onPress={hideAlert} />
        </Dialog.Container>
      )}
    </>
  );
};

export default AlertDialog;
