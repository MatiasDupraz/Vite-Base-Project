import React, { lazy } from "react";
const Icon = lazy(() => import("./Icon"));

const ChatButton = () => {
  const handleSubmit = () => {
    const link = `https://api.whatsapp.com/send?phone=+543534175020&text=Hola! Me comunico desde la página web`;
    window.open(link, "_blank");
  };

  return (
    <div className="z-50 fixed bottom-0 right-0 flex justify-end items-end align-bottom pr-10 py-5 ">
      <div className="relative">
        <div className="mx-auto mt-12 flex max-w-[550px] items-center justify-end space-x-5">
          <button
            className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-neutral-900 text-white p-3"
            onClick={() => {
              handleSubmit();
            }}
          >
            <Icon whatsapp className={"h-full"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatButton;
