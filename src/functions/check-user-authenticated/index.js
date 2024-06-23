import { getStorageItem } from "../../utils/local-storage";

export const checkUserAuthenticated = () => {
  const accessToken = getStorageItem("@user:accessToken");

  return !!accessToken;
};
