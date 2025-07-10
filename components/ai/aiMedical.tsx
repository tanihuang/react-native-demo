import React, { useState } from 'react';
import AiPageImage from './common/aiPageImage';
import AiResultViewer from './common/aiResultViewer';

const config = {
  medicalByImage: {
    key: 'medicalByImage',
    label: 'DenseNet121異常分類',
    description: '使用 DenseNet121 分類是否異常',
    endpoint: '/ai/medicalByImage',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: false,
    threshold: 0.6,
  },
  medicalByMask: {
    key: 'medicalByMask',
    label: 'Monai異常區域偵測',
    description: '',
    endpoint: '/ai/medicalByMask',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: false,
    threshold: 0.6,
  },
} as const;

export default function AiMedical() {
  return <AiPageImage config={config} />;
}
