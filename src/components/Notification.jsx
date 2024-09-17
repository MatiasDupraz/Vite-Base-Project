import { toast } from "react-hot-toast";

const Notification = ({ text, success, error }) => {
  if (success) {
    return toast.success(text, { className: "bg-neutral-900 text-white" });
  } else if (error) {
    return toast.error(text, { className: "bg-neutral-900 text-white" });
  }
};

export default Notification;
