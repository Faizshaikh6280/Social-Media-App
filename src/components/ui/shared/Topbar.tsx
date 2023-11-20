import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccoount } from "@/lib/react-query/queriesAndMutations";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loader from "../../ui/shared/Loader";
function Topbar() {
  const navigate = useNavigate();
  const {
    mutate: signout,
    isSuccess,
    isLoading: isLoggingOut,
  } = useSignOutAccoount();
  const { user } = useUserContext();
  useEffect(
    function () {
      if (isSuccess) {
        navigate("/sign-in");
      }
    },
    [isSuccess, navigate]
  );
  return (
    <section className="topbar md:hidden ">
      <div className="flex justify-between py-4 px-4">
        <Link to="/" className="flex items-center">
          <img src="/public/assets/images/logo.svg" alt="logo" width={130} />
        </Link>
        <div className="flex gap-4">
          <button
            onClick={() => {
              signout();
            }}
          >
            {isLoggingOut ? (
              <Loader />
            ) : (
              <img src="/assets/icons/logout.svg" alt="logout" />
            )}
          </button>
          <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
            <img
              src={user.imageUrl || "/assets/images/profile.png"}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Topbar;
