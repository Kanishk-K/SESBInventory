import React from "react";
import Head from "next/head";
import NavBar from "../Navbar";
import Footer from "../Footer";
import { Flex, Box } from "@chakra-ui/react";

// Hello! My name is Kanishk Kacholia and this site is a portfolio of my experience, projects, and education!
const PageLayout = ({ children, title, description, session, ...props }) => (
  <div>
    <Head>
      <title>{title || "SESB's Inventory Management Tool"}</title>
      <meta property="og:title" content={title || "SESB's Inventory Management Tool"}></meta>
      <meta property="og:title" content={title || "SESB's Inventory Management Tool"}></meta>
      <meta
        name="description"
        content={
          description ||
          "Hello! My name is Kanishk Kacholia and this site is a portfolio of my experience, projects, and education!"
        }
      />
      <meta
        property="og:description"
        content={
          description ||
          "Hello! My name is Kanishk Kacholia and this site is a portfolio of my experience, projects, and education!"
        }
      ></meta>
      <meta
        name="twitter:description"
        content={
          description ||
          "Hello! My name is Kanishk Kacholia and this site is a portfolio of my experience, projects, and education!"
        }
      ></meta>
      <meta
        name="keywords"
        content="portfolio, kanishk, kacholia, kanishk kacholia, projects"
      ></meta>
    </Head>
    <NavBar session={session}/>
    <Box padding={[2, 5, 10]} width={"100%"} minHeight={"85.5vh"} fontFamily={'section'}>
        {children}
    </Box>
    <Footer />
  </div>
);

export default PageLayout;
