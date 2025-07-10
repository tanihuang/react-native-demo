import React, { useState } from 'react';
import AiPageImage from './common/aiPageImage';
import AiResultViewer from './common/aiResultViewer';

const config = {
  classifyByYolo: {
    key: 'classifyByYolo',
    label: 'Yolo預設物件偵測',
    description: '使用 YOLOv8 模型偵測圖片中所有物體，快速標出位置與類別，適合即時、多標籤辨識，優點是速度快、準確率高，缺點是需有標註框資料。',
    endpoint: '/ai/classifyByYolo',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: true,
    threshold: 0.6,
  },
  classifyByHighlight: {
    key: 'classifyByHighlight',
    label: 'Yolo自訓練模型偵測',
    description: '使用你自己標註資料訓練 YOLOv8 模型，針對產品或醫療影像做專屬瑕疵辨識，優點是高度客製化，缺點是需要資料標註與訓練資源。',
    endpoint: '/ai/classifyByHighlight',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: false,
    threshold: 0.6,
  },
  classifyByImage: {
    key: 'classifyByImage',
    label: 'ResNet18圖片分類',
    description: '用 ResNet18 模型判斷整張圖片屬於哪一類（不標框），適合做簡單的分類系統，優點是模型輕量、好部署，缺點是無法指出具體位置。',
    endpoint: '/ai/classifyByImage',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: false,
    threshold: 0.6,
  },
} as const;

export default function AiClassify() {
  return <AiPageImage config={config} />;
}

