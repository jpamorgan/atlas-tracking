var axios = require("axios");

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  function (error) {
    return Promise.reject(error && error.response && error.response.data);
  }
);

const post = (url, data, headers = {}) => {
  return axios({
    method: "post",
    url,
    headers,
    // headers: {
    //   Authorization: `Bearer ${idToken}`,
    // },
    data,
  });
};

module.exports = {
  post,
};
