import React from "react";

const LoadMore = ({ state, fetchDataFun }) => {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        className="text-dark-grey p-2 px-5 hover:bg-grey/30 rounded-md flex items-center gap-2"
        onClick={() => fetchDataFun({ page: state.page + 1 })}
      >
        Load More
      </button>
    );
  }
};

export default LoadMore;
