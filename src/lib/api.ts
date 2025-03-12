import axios from "axios";
import { PrefectureResponse } from "./types";

// api route呼び出しs
export const fetchPrefectures = async (): Promise<PrefectureResponse> => {
  try {
    const response = await axios.get<PrefectureResponse>("/api/prefectures");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch prefectures:", error);
    throw error;
  }
};

//人口
export const fetchPopulationData = async (
  prefCode: number
): Promise<PrefectureResponse> => {
  try {
    const response = await axios.get<PrefectureResponse>(
      `/api/prefectures/population?prefCode=${prefCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch population data:", error);
    throw error;
  }
};
