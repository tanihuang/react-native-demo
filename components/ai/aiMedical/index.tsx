import React, { useState } from 'react';
import AiPage from '../common/aiPage';
import AiResultViewer from '../common/aiResultViewer';

const config = {
  image: {
    key: 'image',
    label: 'X光異常分類',
    description: '使用 DenseNet121 分類是否異常',
    endpoint: '/ai/medicalByImage',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: false,
    threshold: 0.6,
  },
  highlight: {
    key: 'highlight',
    label: 'YOLO自訓練模型偵測',
    description: '使用你自己標註資料訓練 YOLOv8 模型，針對產品或醫療影像做專屬瑕疵辨識，優點是高度客製化，缺點是需要資料標註與訓練資源。',
    endpoint: '/ai/medicalByMask',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: false,
    threshold: 0.6,
  },
} as const;

export default function AiMedical() {
  return <AiPage config={config} />;
}
