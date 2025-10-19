const isDevolpment = import.meta.env.DEV;

export const API_BASE_URL = isDevolpment
  ? "http://jespertl.folk.ntnu.no:8000"
  : "http://jespertl.folk.ntnu.no:8000/";
