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
import { SignupForm } from "@/lib/validation";
import Loader from "@/components/ui/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserAccount,
  useSignInAccoount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isuserLoading } = useUserContext();
  const { mutateAsync: createUserAccount, isLoading: isCreatingUser } =
    useCreateUserAccount();

  const { mutateAsync: signInAccount, isLoading } = useSignInAccoount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupForm>>({
    resolver: zodResolver(SignupForm),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupForm>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({
        title: "Sign up failed please try again.",
      });
    }

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
      navigate("/");
    } else {
      toast({ title: "Sign up failed please try again" });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold md:h2-bold pt-5 sm:pt-4">
          Create a new account
        </h2>
        <p className="text-xs md:text-sm text-gray-300">
          To use Snapgram please enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4 space-y-0"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="bg-white/10" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input bg-white/10"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
            {isCreatingUser ? (
              <div className="flex justify-center items-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>
          <p className="text-sm  text-center">
            Already have an account?
            <Link to="/sign-in" className="text-violet-600 ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default Signup;
