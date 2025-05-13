import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function getCookies(name) {
  const value = `${document.cookie}`;
  const token = value.split(`${name}=`);
  console.log("token: ", token)
  if (token.length === 2) return token.pop().split(" ").shift();
}
console.log("getcookies: ",getCookies("token"));
console.log("document.cookies: ", document.cookie);
// eslint-disable-next-line react-refresh/only-export-components
export default getCookies;

export const ProtectedRoutes = () => {
  const isAuthenticated = getCookies("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" />;
};
