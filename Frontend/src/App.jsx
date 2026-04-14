import { Toaster } from "./components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "./lib/query-client";
// import NavigationTracker from "./lib/NavigationTracker";
import { pagesConfig } from "./pages.config";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import UserNotRegisteredError from "./components/UserNotRegisteredError";
import { useEffect } from "react";

const { Pages, Layout, AdminLayout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const isAdminPage = (pageName) => {
  return pageName.includes('Admin');
};

// Convert page name to route path
const getRoutePath = (pageName) => {
  if (isAdminPage(pageName)) {
    const withoutAdmin = pageName.replace('Admin', '');
    const kebab = withoutAdmin
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    return `/admin/${kebab}`;
  }

  if (pageName === mainPageKey) return '/';
  return `/${pageName}`;
};

const LayoutWrapper = ({ children, currentPageName }) => {
  if (isAdminPage(currentPageName)) {
    return AdminLayout ? (
      <AdminLayout currentPageName={currentPageName}>
        {children}
      </AdminLayout>
    ) : (
      <>{children}</>
    );
  }

  return Layout ? (
    <Layout currentPageName={currentPageName}>
      {children}
    </Layout>
  ) : (
    <>{children}</>
  );
};

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}

const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
    user
  } = useAuth();

  const navigate = useNavigate();

  // 🔥 AUTO REDIRECT ADMIN (MAIN FIX)
  useEffect(() => {
  if (!isLoadingAuth && user?.role === "admin") {
    navigate("/admin/dashboard");
  }
}, [user, isLoadingAuth]);

  // 🔄 Loading state
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ Auth errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // ✅ Routes
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        }
      />

      {Object.entries(Pages).map(([path, Page]) => {
        const routePath = getRoutePath(path);

        if (routePath === '/') return null;

        return (
          <Route
            key={path}
            path={routePath}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        );
      })}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;