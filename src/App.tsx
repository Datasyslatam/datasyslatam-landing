import { MotionConfig } from "framer-motion";
import Index from "./pages/Index.tsx";
import BlogIndex from "./pages/BlogIndex.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import NotFound from "./pages/NotFound.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import { findLanding } from "./landing/pages.ts";
import type { Route } from "./routes.ts";
import type { BlogPost as BlogPostData } from "./blog/types.ts";

interface AppProps {
  route: Route;
  /** Artículo ya cargado cuando la ruta es /blog/<slug>; null si no existe. */
  post: BlogPostData | null;
}

const App = ({ route, post }: AppProps) => (
  <MotionConfig reducedMotion="user">
    {route.type === "home" ? (
      <Index />
    ) : route.type === "landing" && findLanding(route.path) ? (
      <LandingPage page={findLanding(route.path)!} />
    ) : route.type === "blog-index" ? (
      <BlogIndex />
    ) : route.type === "blog-post" && post ? (
      <BlogPost post={post} />
    ) : (
      <NotFound />
    )}
  </MotionConfig>
);

export default App;
