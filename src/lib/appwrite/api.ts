import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteconfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("account is not created");

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}
export async function getCurrentUser() {
  try {
    const cuurentAccount = await account.get();
    if (!cuurentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal("accountId", cuurentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error + "💥");
  }
}

export async function createPost(post: INewPost) {
  try {
    // upload file to storage.
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;
    //creating post in databse.
    // get File.
    const fileUrl = await getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      // if something  there is currepted in storage.
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // convert tags into an string array.
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteconfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}
export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteconfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteconfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getRecentPost() {
  const posts = await databases.listDocuments(
    appwriteconfig.databaseId,
    appwriteconfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  else return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        posts: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(saveRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteconfig.databaseId,
      appwriteconfig.savesCollectionId,
      saveRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      postId
    );
    if (!post) throw Error;
    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasToUpdateImage = post?.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasToUpdateImage) {
      // upload file to storage.
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      //creating post in databse.
      // get File.
      const fileUrl = await getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        // if something  there is currepted in storage.
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageId: uploadedFile.$id, imageUrl: fileUrl };
    }
    // convert tags into an string array.
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const updatedPost = await databases.updateDocument(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags,
      }
    );
    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deletePost(
  postId: string | undefined,
  imageId: string | undefined
) {
  console.log(postId);
  if (!postId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      postId
    );
  } catch (error) {
    console.log(error);
  }
}
export async function geInifinitePost({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(2)];
  if (pageParam) {
    queries.push([Query.cursorAfter(pageParam.toString())]);
  }
  try {
    const posts = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      queries
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}
export async function searchPost(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}
