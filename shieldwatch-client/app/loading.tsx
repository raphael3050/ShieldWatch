// app/loading.tsx (ou components/Loading.tsx si vous utilisez /pages)
"use client";

import { Spinner } from "@nextui-org/spinner";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  );
};

export default Loading;
