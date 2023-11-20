import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultsProps = {
  isSearchfetching: boolean;
  searchPosts: Models.Document[];
};

function SearchResults({ isSearchfetching, searchPosts }: SearchResultsProps) {
  if (isSearchfetching) return <Loader />;

  if (searchPosts?.documents.length > 0) {
    return <GridPostList posts={searchPosts?.documents} />;
  }
  return (
    <p className="text-gray-300 mt-10 w-full text-center">No results found</p>
  );
}

export default SearchResults;
