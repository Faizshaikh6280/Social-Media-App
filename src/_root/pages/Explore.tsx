import GridPostList from "@/components/ui/shared/GridPostList";
import Loader from "@/components/ui/shared/Loader";
import SearchResults from "@/components/ui/shared/SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetPost,
  useSearchPost,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
function Explore() {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPost();
  const [searchValue, setSearchValue] = useState("");
  const debounceValue = useDebounce(searchValue, 500);
  const { data: searchPost, isLoading: isSearching } =
    useSearchPost(debounceValue);
  useEffect(
    function () {
      if (inView && !searchValue) {
        fetchNextPage();
      }
    },
    [inView, searchValue, fetchNextPage]
  );

  if (!posts) {
    return (
      <div className="flex justify-center items-center w-full">
        <Loader />
      </div>
    );
  }
  const shouldShowSearchResult = searchValue !== "";
  const shouldNotShowPosts =
    !shouldShowSearchResult &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className=" w-full px-4">
      <h1 className="font-medium text-xl md:pt-6">Search Posts</h1>
      <div className="input  bg-white/5 px-2 py-3 flex gap-3 items-center rounded-md mt-2">
        <img
          src="/assets/icons/search.svg"
          width={16}
          height={16}
          alt="search"
        />
        <input
          type="text"
          placeholder="Search post"
          className="text-sm bg-transparent border-none outline-none"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="posts-container mt-12 text-lg ">
        <div className="flex justify-between">
          <h2>Popular posts</h2>
          <div className="flex gap-2">
            <h3>All</h3>{" "}
            <img
              src="/assets/icons/filter.svg"
              alt="filter"
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="posts">
          {shouldShowSearchResult ? (
            <SearchResults
              isSearchfetching={isSearching}
              searchPosts={searchPost}
            />
          ) : shouldNotShowPosts ? (
            <p className="text-white mt-10 text-center w-full">End of posts</p>
          ) : (
            posts.pages?.map((item, index) => (
              <GridPostList key={`page-${index}`} posts={item?.documents} />
            ))
          )}
        </div>
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Explore;
