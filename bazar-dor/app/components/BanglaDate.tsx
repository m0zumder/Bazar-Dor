"use client";

import { useEffect, useState } from "react";

export default function BanglaDate() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("bn-BD", {
        dateStyle: "full",
        timeZone: "Asia/Dhaka",
      }).format(new Date()),
    );
  }, []);

  return <>{today || "আজকের বাজারদর"}</>;
}