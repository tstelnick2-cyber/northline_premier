import { useEffect, useRef } from "react";
import { ClerkProvider, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { LandingPage } from "@/pages/Landing";
import { SignInPage, SignUpPage } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { Documents } from "@/pages/Documents";
import { Messages } from "@/pages/Messages";
import { Employees } from "@/pages/admin/Employees";
import { UploadDocument } from "@/pages/admin/Upload";
import { AdminMessages } from "@/pages/admin/AdminMessages";
import { AppLayout } from "@/components/Layout";
import { useGetMe } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(221 45% 18%)",
    colorBackground: "hsl(0 0% 100%)",
    fontFamily: "'Inter', sans-serif",
    colorText: "hsl(222 47% 11%)",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-sm border",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
  },
};

const queryClient = new QueryClient();

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  return (
    <>
      <Show when="signed-in">
        <AuthGate component={Component} adminOnly={adminOnly} />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function AuthGate({ component: Component, adminOnly }: { component: any, adminOnly: boolean }) {
  const { data: user, isLoading } = useGetMe();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  }
  
  if (adminOnly && user?.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }
  
  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          
          <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
          <Route path="/documents"><ProtectedRoute component={Documents} /></Route>
          <Route path="/messages"><ProtectedRoute component={Messages} /></Route>
          
          <Route path="/admin/employees"><ProtectedRoute component={Employees} adminOnly /></Route>
          <Route path="/admin/upload"><ProtectedRoute component={UploadDocument} adminOnly /></Route>
          <Route path="/admin/messages"><ProtectedRoute component={AdminMessages} adminOnly /></Route>
          
          <Route component={NotFound} />
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <Router />
      <Toaster />
    </WouterRouter>
  );
}
