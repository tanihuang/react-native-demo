// services/ai.ts
export async function getDefectResult(): Promise<{
  imageUrl: string;
  results: {
    label: string;
    confidence: number;
    box: { x: number; y: number; width: number; height: number };
  }[];
}> {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    imageUrl: 'https://raw.githubusercontent.com/ultralytics/yolov5/master/data/images/bus.jpg',
    results: [
      {
        label: 'crack',
        confidence: 0.87,
        box: { x: 100, y: 150, width: 120, height: 80 },
      },
      {
        label: 'defect',
        confidence: 0.92,
        box: { x: 250, y: 220, width: 100, height: 100 },
      },
    ],
  };
}
