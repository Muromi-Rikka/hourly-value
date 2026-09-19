import "./app.css";
import { RouterProvider } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { router } from "@/router";

gsap.registerPlugin(ScrollTrigger); // eslint-disable-line unicorn/no-top-level-side-effects -- GSAP plugin registration must run once at module scope

export default function App() {
  return <RouterProvider router={router} />;
}
