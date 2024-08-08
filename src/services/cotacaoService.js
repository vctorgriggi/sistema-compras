import { index } from "./index";

const serviceUrl = "/cotacao";

export async function create(dto) {
  try {
    await index.post(serviceUrl, dto);
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

export async function get() {
  try {
    const response = await index.get(serviceUrl);
    return response.data;
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

export async function getById(id) {
  try {
    const response = await index.get(`${serviceUrl}/${id}`);
    return response.data;
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

export async function updateById(id, dto) {
  try {
    const response = await index.put(`${serviceUrl}/${id}`, dto);
    return response.data;
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

export async function deleteById(id) {
  try {
    await index.delete(`${serviceUrl}/${id}`);
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
