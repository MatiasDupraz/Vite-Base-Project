import React from "react";

const SectionTitle = ({ text }) => {
  return (
    <div className="bg-neutral-900 text-gray-50 uppercase text-center w-full py-2 text-sm md:text-lg tracking-wide md:tracking-widest my-4 select-none font-inter font-medium md:font-semibold">
      {text}
    </div>
  );
};

export default SectionTitle;
