import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

function PostCard({ post }: PostCardProps) {
  const { user } = useUserContext();
  if (!post.creator) return;
  return (
    <div className="post-card rounded-xl  py-3 px-6 bg-white/5 ">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${post.creator.$id}`}>
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
          <p className="font-medium text-white">{post.creator.name}</p>
          <div className="flex items-center text-gray-500 text-xs">
            <p className="mr-1">{multiFormatDateString(post.$createdAt)}</p>-
            <p className="ml-1">{post.location}</p>
          </div>
        </div>
        {post.creator.$id === user.id && (
          <Link to={`/update-post/${post.$id}`} className="ml-auto">
            <img
              src="/assets/icons/edit.svg"
              alt="edit-icon"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="text-base py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-0 mt-2 text-sm flex-wrap">
            {post.tags.map((tag: string) => {
              return (
                <li key={tag} className="text-gray-500">
                  #{tag}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={`overflow-hidden`}>
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post-img"
            width={500}
            className="object-contain object-left-top rounded-3xl m-auto h-auto"
          />
        </div>
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
}

export default PostCard;
