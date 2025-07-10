import React, { useState } from 'react';
import AiPageDocument from '../common/aiPageDocument';
import AiResultViewer from '../common/aiResultViewer';

const config = {
  contractByHighlight: {
    key: 'contractByHighlight',
    label: 'OCR擷取合約文字',
    description: '使用 OCR 擷取合約文字，自動偵測風險關鍵詞並框選顯示，輔助理解與判斷潛在法律爭議，適用於圖片合約檔或拍照輸入。',
    endpoint: '/ai/contract/upload',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: true,
    threshold: 0.6,
  },
} as const;

export default function AiContract() {
  return <AiPageDocument config={config} />;
}

