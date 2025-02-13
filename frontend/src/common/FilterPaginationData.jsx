export const filterPaginationData = ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send,
}) => {
  let obj;

  if (state != null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
  }
};
