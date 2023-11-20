import { sidebarLinks } from "@/constant";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccoount } from "@/lib/react-query/queriesAndMutations";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import Loader from "./Loader";
import { useEffect } from "react";

function LeftsideBar() {
  const {
    mutate: signout,
    isSuccess,
    isLoading: isLoggingOut,
  } = useSignOutAccoount();
  const { user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (isSuccess) {
        navigate("/sign-in");
      }
    },
    [isSuccess, navigate]
  );
  return (
    <section className="hidden md:block leftsideBar p-6 ">
      <div className="flex flex-col gap-10  h-[90vh] ">
        <Link to="/" className="flex items-center">
          <img src="/public/assets/images/logo.svg" alt="logo" width={150} />
        </Link>
        <div className="userProfile flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/images/profile.png"}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="user-info flex flex-col gap-0">
            <p className="font-bold text-base">{user.name || "unknown"}</p>
            <p className="text-sm text-gray-500">
              @{user.username || "unknown"}
            </p>
          </div>
        </div>
        <ul className="navLinks flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = location.pathname === link.route;
            return (
              <li key={link.label} className="group">
                <NavLink
                  to={link.route}
                  className={`${
                    isActive && "bg-violet-500"
                  } text-base flex gap-3 p-4 hover:bg-violet-500 hover:text-white transition rounded-lg`}
                >
                  <img
                    src={link.imgURL}
                    alt="navlink"
                    width={20}
                    height={16}
                    className={`
                    group-hover:brightness-0
                    ${isActive && "brightness-0"}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => {
            signout();
          }}
          className="flex gap-3  items-center text-base  pl-4 mt-auto"
        >
          {isLoggingOut === false && (
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              width={20}
              height={16}
            />
          )}
          {isLoggingOut ? (
            <>
              <div className="flex gap-3 items-center">
                <Loader />
                <p>Loading...</p>
              </div>
            </>
          ) : (
            <span>Log out</span>
          )}
        </button>
      </div>
    </section>
  );
}

export default LeftsideBar;
