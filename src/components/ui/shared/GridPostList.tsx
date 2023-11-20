import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "../PostStats";
type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};
function GridPostList({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) {
  const { user } = useUserContext();

  return (
    <ul className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5x mt-5">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link
            to={`/posts/${post.$id}`}
            className="flex rounded-[24px]  overflow-hidden cursor-pointer w-full h-full"
          >
            <img
              src={post.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-black to-transparent rounded-b-[24px] gap-2 from-25% ">
            {showUser && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2 items-center">
                  <img
                    src={post.creator.imageUrl}
                    alt="creator"
                    className="h-8 w-8 rounded-full"
                  />
                  <p className="line-clamp-1 text-sm">{post.creator.name}</p>
                </div>
                {showStats && (
                  <PostStats post={post} userId={user.id} isExplore={true} />
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default GridPostList;
