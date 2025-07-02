import AiClassify from '@/components/ai/aiClassify';
import AiMedicalImagingAid from '@/components/ai/aiMedicalImagingAid';
import AiContractRiskAssistant from '@/components/ai/aiContractRiskAssistant';
import AiStockAutoSummary from '@/components/ai/aiStockAutoSummary';
import AiInteractiveAgent from '@/components/ai/aiInteractiveAgent';

export const Ai = [
  {
    key: 'classify',
    title: 'AI 瑕疵分類平台',
    description:
      '上傳產品影像，自動辨識瑕疵區域，並顯示結果與信心分數\nYOLOv8 + FastAPI + React.js\n展現影像模型整合 + 前端標註視覺化',
    icon: 'image-outline',
    path: '/ai',
    component: AiClassify,
  },
  {
    key: 'medical',
    title: 'AI 醫療圖像輔助判讀系統',
    description:
      '上傳 X-ray 或 CT 圖片，自動辨識可疑區域（DEMO 資料）\nPyTorch + MONAI + Gradio/React\n展現醫療影像處理能力與責任感',
    icon: 'medkit-outline',
    path: '/ai',
    component: AiMedicalImagingAid,
  },
  {
    key: 'contract',
    title: 'AI 合約風險助理（RAG）',
    description:
      '上傳合約檔，自動摘要並標記潛在風險段落，可追問\nLangChain + HuggingFace + FastAPI + React\n展現 NLP 技術與資料查詢 API 能力',
    icon: 'document-text-outline',
    path: '/ai',
    component: AiContractRiskAssistant,
  },
  {
    key: 'stock',
    title: 'AI 自動股市分析摘要',
    description:
      '每日自動分析股票技術指標，寄送報告或產出摘要 API\nFastAPI + SQLite + Scheduler + Gmail API\n展現資料抓取、自動化、指標計算與報表能力',
    icon: 'bar-chart-outline',
    path: '/ai',
    component: AiStockAutoSummary,
  },
  {
    key: 'agent',
    title: 'AI 互動角色系統（對話＋表情）',
    description:
      '可鍵盤控制的互動角色，回答問題並根據語意變換表情\nLLM + WebSocket + Canvas/WebGL + GGUF\n展現 AI agent 技術、互動與即時性設計',
    icon: 'chatbubble-ellipses-outline',
    path: '/ai',
    component: AiInteractiveAgent,
  },
];
