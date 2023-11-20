import PostCard from "@/components/ui/PostCard";
import Loader from "@/components/ui/shared/Loader";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

function Home() {
  const {
    data: posts,
    isLoading: isPostLoading,
    // isError: isErrorPost,
  } = useGetRecentPosts();

  // const isPostLoading = true;
  return (
    <div className="flex flex-1 ">
      <div className="home-container px-4 w-full md:pt-6 md:basis-3/4">
        <div className="home-post flex justify-center flex-col gap-4 items-center  ">
          <h2 className="font-medium text-left self-start text-xl md:text-2xl">
            Home Feed
          </h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => {
                return (
                  <li key={post.$id}>
                    <PostCard post={post} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
