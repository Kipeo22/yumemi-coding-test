import axios from "axios";
import { PrefectureResponse } from "./types";

const API_BASE_URL: string = process.env.NEXT_PUBLIC_RESAS_BASE_URL || "";
const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY || "";
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
  },
});

// 都道府県一覧を取得
export const fetchPrefectures = async (): Promise<PrefectureResponse> => {
  try {
    const response = await client.get<PrefectureResponse>(
      "/api/v1/prefectures"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch prefectures:", error);
    throw error;
  }
};
