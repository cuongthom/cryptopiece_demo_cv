const responseMiddleware = ({ set, response }: any) => {
  set.status = 200;
  return {
    status: 200,
    message: "Success",
    data: response,
  };
};
export default responseMiddleware;
