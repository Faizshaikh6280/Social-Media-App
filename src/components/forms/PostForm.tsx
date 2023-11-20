import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { PostValidate } from "@/lib/validation";
import { Models } from "appwrite";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast as toastHot } from "react-hot-toast";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

function PostForm({ post, action }: PostFormProps) {
  const { mutateAsync: createPost, isLoading: isCreatingPost } =
    useCreatePost();

  const { mutateAsync: updatPost, isLoading: isUpdatingPost } = useUpdatePost();

  const { user } = useUserContext();
  // const { toast } = useToast();
  const navigate = useNavigate();
  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidate>>({
    resolver: zodResolver(PostValidate),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post?.location || "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidate>) {
    if (post && action === "Update") {
      const updatedPost = await updatPost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });
      if (!updatedPost) {
        toastHot.error("Update fail! please try again");
      }
      return navigate(`/posts/${post.$id}`);
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newPost = await createPost({ ...values, userId: user.id });
    if (!newPost) {
      toastHot.success("Something went wrong try again");
    } else {
      toastHot.success("Post successfully created");
      navigate("/");
    }
  }
  return (
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-9 w-full max-w-5xl"
        >
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="write something about post."
                    className="shad-textarea custom-scrollbar bg-white/10 border-none "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your location"
                    className="bg-white/10 border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Add Tags ( separated by " , " comma )
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Js , React , Nextjs"
                    className="bg-white/10 border-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4 w-full ">
            <Button type="button" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-violet-500 hover:bg-violet-600"
              disabled={isCreatingPost || isUpdatingPost}
            >
              {action} post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PostForm;
