import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import Loader from "../ui/shared/Loader";
import React, { useEffect, useState } from "react";

type PostStatsProp = {
  post: Models.Document;
  userId: string;
  isExplore?: boolean;
};

function PostStats({ post, userId, isExplore = false }: PostStatsProp) {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isLoading: isLiking } = useLikePost();
  const { mutate: savePost, isLoading: isSaving } = useSavePost();
  const { mutate: deleteSavedPost, isLoading: isDeleting } =
    useDeleteSavePost();
  const { data: currentUser } = useGetCurrentUser();

  const savePostRecord = currentUser?.save.find(
    (record: Models.Document) => record.posts.$id === post.$id
  );

  useEffect(
    function () {
      setIsSaved(!!savePostRecord);
    },
    [savePostRecord, currentUser]
  );

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id: string) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savePostRecord) {
      deleteSavedPost(savePostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
    }
    setIsSaved((x) => !x);
  };

  return (
    <div className={`flex ${!isExplore ? "justify-between" : ""} items-center`}>
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like-icon"
          onClick={handleLikePost}
          className="cursor-pointer"
        />

        <p className="text-sm lg:text-base">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="like-icon"
          onClick={handleSavePost}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

export default PostStats;
