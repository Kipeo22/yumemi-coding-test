export interface Prefecture {
  prefCode: number;
  prefName: string;
}

export interface PrefectureResponse {
  message: null | string;
  result: Prefecture[];
}

// 人口データの型
export interface PopulationData {
  year: number;
  value: number;
}

export interface PopulationCategory {
  label: string;
  data: PopulationData[];
}

// API からの人口データレスポンスの型
export interface PopulationResponse {
  message: string | null;
  result: {
    boundaryYear: number;
    data: PopulationCategory[];
  };
}
