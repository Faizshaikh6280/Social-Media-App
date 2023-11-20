import PostForm from "@/components/forms/PostForm";
function CreatePost() {
  return (
    <div className="create-post px-6 w-full flex flex-col gap-8 mt-4  md:basis-3/4 py-3">
      <div className="heading flex gap-3 text-lg font-medium">
        <img src="/assets/icons/add-post.svg" alt="add" width={28} />
        <h2>Create Post</h2>
      </div>
      <PostForm action="Create" />
    </div>
  );
}

export default CreatePost;
