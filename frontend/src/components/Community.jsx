// Community.js
import React from "react";

const Community = () => {
  return (
    <div className="w-full bg-bg p-6 rounded-lg shadow-md h-[80vh]">
      <h3 className="text-xl font-bold mb-4">GetConnect Community</h3>
      <div className="flex flex-col gap-2">
        <button className="bg-slate-200 text-[#111] py-2 rounded-md hover:bg-slate-300">
          Learner
        </button>
        <button className="bg-slate-200 text-[#111] py-2 rounded-md hover:bg-slate-300">
          JAVA
        </button>
        <button className="bg-slate-200 text-[#111] py-2 rounded-md hover:bg-slate-300">
          DSA
        </button>
        <button className="bg-slate-200 text-[#111] py-2 rounded-md hover:bg-slate-300">
          Web Development
        </button>
      </div>
    </div>
  );
};

export default Community;
