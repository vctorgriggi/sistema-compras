import { index } from "./index";

const serviceUrl = "/fp";

export async function add(produtoId, fornecedorId) {
  try {
    await index.post(`${serviceUrl}/${produtoId}`, {
      fornecedorId,
    });
    return;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error("Response error:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An error occurred while processing your request.");
    }
  }
}

export async function remove(produtoId, fornecedorId) {
  try {
    await index.delete(`${serviceUrl}/${produtoId}`, {
      data: { fornecedorId }, // data is required to send a body in a DELETE request
    });
    return;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error("Response error:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Unknown error:", error.message);
      throw new Error("An error occurred while processing your request.");
    }
  }
}
