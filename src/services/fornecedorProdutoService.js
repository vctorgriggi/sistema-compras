import { index } from "./index";

const serviceUrl = "/fp/produto-id";

export async function add(produtoId, fornecedorId) {
  try {
    const response = await index.post(`${serviceUrl}/${produtoId}`, {
      data: { fornecedorId }, // data is required to send a body in a POST request
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("response error:", error.response.data);
      throw new Error(error.response.data);
    } else if (error.request) {
      console.error("request error:", error.request);
      throw new Error("Unable to get a response from the server.");
    } else {
      console.error("unknown error:", error.message);
      throw new Error("An error occurred while processing your request.");
    }
  }
}

export async function remove(produtoId, fornecedorId) {
  try {
    const response = await index.delete(`${serviceUrl}/${produtoId}`, {
      data: { fornecedorId }, // data is required to send a body in a DELETE request
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("response error:", error.response.data);
      throw new Error(error.response.data);
    } else if (error.request) {
      console.error("request error:", error.request);
      throw new Error("Unable to get a response from the server.");
    } else {
      console.error("unknown error:", error.message);
      throw new Error("An error occurred while processing your request.");
    }
  }
}
