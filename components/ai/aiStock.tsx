import React, { useState } from 'react';
import AiPageDocument from './common/aiPageDocument';
import AiResultViewer from './common/aiResultViewer';

const config = {
  contractByHighlight: {
    key: 'contractByHighlight',
    label: '自動股市分析摘要',
    description: '',
    endpoint: '/ai/contract/upload',
    component: (props: any) => <AiResultViewer {...props} />,
    confidence: true,
    threshold: 0.6,
  },
} as const;

export default function AiStock() {
  return null;
}

