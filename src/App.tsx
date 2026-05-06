import { Outlet } from "react-router-dom";

import { Header } from "./components/layout/Header/Header";
import { PageContainer } from "./components/layout/PageContainer/PageContainer";
import { SkipLink } from "./components/layout/SkipLink/SkipLink";

export default function App() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <Header />
      <PageContainer>
        <Outlet />
      </PageContainer>
    </>
  );
}
