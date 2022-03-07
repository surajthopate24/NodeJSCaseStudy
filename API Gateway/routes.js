const ROUTES = [
  {
    url: "/foodservice",
    proxy: {
      target: "http://localhost:3000/",
      changeOrigin: true,
      pathRewrite: {
        [`^/foodservice`]: "",
      },
    },
  },
  {
    url: "/passengerservice",
    proxy: {
      target: "http://localhost:4000/",
      changeOrigin: true,
      pathRewrite: {
        [`^/passengerservice`]: "",
      },
    },
  },
  {
    url: "/orderservice",
    proxy: {
      target: "http://localhost:5000/",
      changeOrigin: true,
      pathRewrite: {
        [`^/orderservice`]: "",
      },
    },
  },
];

exports.ROUTES = ROUTES;
