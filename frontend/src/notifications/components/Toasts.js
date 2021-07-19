import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

export function Toasts() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}
