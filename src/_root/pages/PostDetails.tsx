import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutations";
import Loader from "../../components/ui/shared/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import React from "react";
import toast from "react-hot-toast";
import PostStats from "@/components/ui/PostStats";

function PostDetails() {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id || "");
  const { user } = useUserContext();
  const { mutate: deletePost, isLoading: isDeleting } = useDeletePost();
  const navigate = useNavigate();
  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deletePost(
      { postId: post?.$id, imageId: post?.imageId },
      {
        onSuccess: () => {
          navigate("/");
          toast.success("Post successfully deleted");
        },
      }
    );
  }
  return (
    <div
      className="flex flex-col md:flex-row px-6 md:px-0 md:pt-8  md:basis-3/4 gap-3  h-2/4
   "
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="imgContainer basis-2/4  overflow-hidden rounded-t-2xl md:rounded-none md:rounded-l-2xl flex-shrink-0">
            <img
              src={post?.imageUrl}
              alt="post"
              className="object-contain  flex-shrink-0"
            />
          </div>
          <div className="h-full">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${post?.creator.$id}`}>
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assests/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 lg:w-10"
                />
              </Link>
              <div className="flex-col text-sm">
                <p className="font-medium text-white">{post?.creator.name}</p>
                <div className="flex items-center text-gray-500 text-xs">
                  <p className="mr-1">
                    {multiFormatDateString(post?.$createdAt)}
                  </p>
                  -<p className="ml-1">{post?.location}</p>
                </div>
              </div>
              {post?.creator.$id === user.id && (
                <Link to={`/update-post/${post?.$id}`} className="ml-auto">
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit-icon"
                    width={18}
                    height={18}
                  />
                </Link>
              )}
              {post?.creator.$id === user.id && (
                <button className="" disabled={isDeleting}>
                  <img
                    src="/assets/icons/delete.svg"
                    alt="edit-icon"
                    width={18}
                    height={18}
                    onClick={handleDelete}
                  />
                </button>
              )}
            </div>
            <div>
              <Link to={`/posts/${post?.$id}`} className="flex-1">
                <div className="text-base py-5">
                  <p>{post?.caption}</p>
                  <ul className="flex gap-0 mt-0 text-sm flex-wrap">
                    {post?.tags.map((tag: string) => {
                      return (
                        <li key={tag} className="text-gray-500">
                          #{tag}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Link>
              <div className="mt-auto">
                {post && <PostStats post={post} userId={user.id} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PostDetails;
