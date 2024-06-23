import { index } from "./index";

const serviceUrl = "/contato";

export async function create(dto) {
  try {
    const response = await index.post(serviceUrl, dto);
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

export async function get() {
  try {
    const response = await index.get(serviceUrl);
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

export async function getById(id) {
  try {
    const response = await index.get(`${serviceUrl}/id/${id}`);
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

export async function updateById(id, dto) {
  try {
    const response = await index.put(`${serviceUrl}/id/${id}`, dto);
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

export async function deleteById(id) {
  try {
    const response = await index.delete(`${serviceUrl}/id/${id}`);
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
