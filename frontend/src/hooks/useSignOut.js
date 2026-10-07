import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useLogoutMutation } from "../store/usersApi";
import { logout } from "../store/authSlice";

export function useSignOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  return async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      /* cookie may already be gone; sign out locally anyway */
    }
    dispatch(logout());
    toast.success("Signed out. Keep on rockin'.");
    navigate("/login");
  };
}
