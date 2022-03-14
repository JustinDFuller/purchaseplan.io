import { toast } from "react-toastify";

export function show(Component) {
  return toast.dark(Component, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
