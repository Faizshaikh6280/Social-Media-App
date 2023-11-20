import AuthLayout from "./_auth/AuthLayout";
import Signin from "./_auth/forms/Signin";
import Signup from "./_auth/forms/Signup";
import RootLayout from "./_root/RootLayout";
import "./global.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToasterHot } from "react-hot-toast";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
  Home,
} from "./_root/pages";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Private Route */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/sign-up" element={<Signup />} />
        </Route>
        {/* Public rotes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id/*" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
      <ToasterHot
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
          style: {
            padding: "16px 24px",
            fontSize: "16px",
            maxWidth: "500px",
            backgroundColor: "white",
            color: "black",
          },
        }}
      />
    </main>
  );
}

export default App;
