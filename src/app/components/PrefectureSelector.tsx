import React, { useEffect, useState } from "react";
import { Prefecture } from "../../lib/types";
import { fetchPrefectures } from "../../lib/api";
const PrefectureSelector = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const fetchPrefecturesData = async () => {
      try {
        const response = await fetchPrefectures();
        setPrefectures(response.result);
      } catch (error) {
        console.error("Failed to fetch prefectures:", error);
      }
    };
    fetchPrefecturesData();
  }, []);

  return (
    <div>
      <h2>都道府県一覧</h2>
      <div>
        {prefectures.map(
          (prefecture) => (
            console.log(prefecture.prefName),
            (
              <label key={prefecture.prefCode}>
                <input type="checkbox" />
                {prefecture.prefName}
              </label>
            )
          )
        )}
      </div>
    </div>
  );
};

export default PrefectureSelector;
