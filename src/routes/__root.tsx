import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="glass-card"
        style={{ padding: 40, textAlign: "center", maxWidth: 440 }}
      >
        <h1 style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em" }}>
          404
        </h1>
        <h2 style={{ fontSize: 18, marginTop: 8 }}>Page not found</h2>
        <p
          style={{
            marginTop: 8,
            color: "var(--text-secondary)",
            fontSize: 14,
          }}
        >
          The page you're looking for doesn't exist.
        </p>
        <div style={{ marginTop: 24 }}>
          <Link to="/" className="glass-btn glass-btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="glass-card"
        style={{ padding: 40, textAlign: "center", maxWidth: 440 }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</h1>
        <p
          style={{
            marginTop: 8,
            color: "var(--text-secondary)",
            fontSize: 14,
          }}
        >
          {error.message || "Try again or head back home."}
        </p>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="glass-btn glass-btn-primary"
          >
            Try again
          </button>
          <a href="/" className="glass-btn">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15, 15, 30, 0.92)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
