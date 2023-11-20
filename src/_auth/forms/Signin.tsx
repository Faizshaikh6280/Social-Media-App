import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import "../../global.css";
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
import { SigninForm } from "@/lib/validation";
import Loader from "@/components/ui/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccoount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { toast as toastHot } from "react-hot-toast";
function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isuserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isLoading: isSigningUser } =
    useSignInAccoount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninForm>>({
    resolver: zodResolver(SigninForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninForm>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({
        title: "Sign in failed please try again.",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      toastHot.success("Successfully login!");
      navigate("/");
    } else {
      toastHot.error("Sign up failed please try again");
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold md:h2-bold pt-5 sm:pt-4">
          Log into your account
        </h2>
        <p className="text-xs md:text-sm text-gray-300"></p>
        Welcome back! Please enter your details
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4 space-y-0"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="bg-white/10" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="bg-white/10" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-violet-600">
            {isSigningUser ? (
              <div className="flex justify-center items-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-sm  text-center">
            Don't have an account ?
            <Link to="/sign-up" className="text-violet-600 ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default Signup;
