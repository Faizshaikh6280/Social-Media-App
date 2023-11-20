import { bottombarLinks } from "@/constant";
import { Link, useLocation } from "react-router-dom";

function Bottombar() {
  const { pathname } = useLocation();
  return (
    <section className=" px-4 py-1 md:hidden mt-3 fixed bottom-0 w-full bg-black rounded-t-2xl">
      <ul className="flex justify-around">
        {bottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li key={link.label} className="group">
              <Link
                to={link.route}
                className={`${
                  isActive && "bg-violet-500"
                } text-sm flex flex-col gap-1 items-center  p-2 hover:bg-violet-500  first-letter:hover:text-white transition rounded-lg`}
              >
                <img
                  src={link.imgURL}
                  alt="navlink"
                  width={16}
                  height={16}
                  className={`
                    group-hover:brightness-0
                    ${isActive && "brightness-0"} `}
                />
                <p className="text-xs text-gray-300"> {link.label}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Bottombar;
