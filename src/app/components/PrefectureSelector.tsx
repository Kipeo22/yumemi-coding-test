import React, { useEffect, useState } from "react";
import { Prefecture } from "../../lib/types";
import { fetchPrefectures } from "../../lib/api";
import PopulationGraph from "./PopulationGraph";

const PrefectureSelector = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [prefectureNames, setPrefectureNames] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    const fetchPrefecturesData = async () => {
      try {
        const response = await fetchPrefectures();
        setPrefectures(response.result);

        const nameMap: Record<number, string> = {};
        response.result.forEach((pref) => {
          nameMap[pref.prefCode] = pref.prefName;
        });
        setPrefectureNames(nameMap);
      } catch (error) {
        console.error("Failed to fetch prefectures:", error);
      }
    };
    fetchPrefecturesData();
  }, []);

  const handleChange = (prefCode: number) => {
    setSelectedPrefectures((prev) => {
      if (prev.includes(prefCode)) {
        return prev.filter((code) => code !== prefCode);
      } else {
        return [...prev, prefCode];
      }
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", padding: "20px 0" }}>都道府県一覧</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          flexWrap: "wrap",
          margin: "0 20px",
        }}
      >
        {prefectures.map(
          (prefecture) => (
            console.log(prefecture.prefName),
            (
              <label key={prefecture.prefCode} style={{ margin: "5px" }}>
                <input
                  type="checkbox"
                  onChange={() => handleChange(prefecture.prefCode)}
                  checked={selectedPrefectures.includes(prefecture.prefCode)}
                />
                {prefecture.prefName}
              </label>
            )
          )
        )}
      </div>
      <PopulationGraph
        selectedPrefectures={selectedPrefectures}
        prefectureNames={prefectureNames}
      />
    </div>
  );
};

export default PrefectureSelector;
