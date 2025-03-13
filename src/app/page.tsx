"use client";
import React from "react";
import PrefectureSelector from "@/app/components/PrefectureSelector";
import Title from "@/app/components/title";

export default function Home() {
  return (
    <div>
      <Title />
      <PrefectureSelector />
    </div>
  );
}
