import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import Loader from "../../components/ui/shared/Loader";
import { useParams } from "react-router-dom";
function EditPOst() {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || "");
  if (isLoading) return <Loader />;
  return (
    <div className="create-post px-6 w-full flex flex-col gap-8 mt-4  md:basis-3/4 py-3">
      <div className="heading flex gap-3 text-lg font-medium">
        <img src="/assets/icons/add-post.svg" alt="add" width={28} />
        <h2>Edit Post</h2>
      </div>
      <PostForm post={post} action="Update" />
    </div>
  );
}

export default EditPOst;
