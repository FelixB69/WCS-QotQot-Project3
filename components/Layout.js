import Head from "next/head";
import Header from "../components/Header";
import HeaderCommandePassee from "../components/HeaderCommandePassee";
import LoadingSpin from "../components/LoadingSpin";
import { useContext } from "react";
import { signIn, useSession } from "next-auth/react";
import { CurrentUserContext } from "../contexts/currentUserContext";

export default function Layout({ children, pageTitle }) {
  const { currentUserLogged } = useContext(CurrentUserContext);
  const { status } = useSession();

  if (currentUserLogged) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href={`https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,400;0,500;1,300&display=swap`}
            rel="stylesheet"
          />
        </Head>
        {pageTitle === "commandes" ? (
          <Header></Header>
        ) : pageTitle === "detail-commande" ? (
          <HeaderCommandePassee></HeaderCommandePassee>
        ) : (
          <Header></Header>
        )}
        {children}
      </>
    );
  }

  return (
    <div>
      {status === "loading" || status === "authenticated" ? (
        <LoadingSpin></LoadingSpin>
      ) : (
        <>
          <p className="flex flex-col justify-center items-center bg-[red] text-white h-full text-xl text-center">
            Merci de bien vouloir vous connecter pour accéder à l'appli qotqot.{" "}
          </p>
          <div className="flex justify-center ">
            <button
              type="button"
              className="mt-6 text-white uppercase bg-[green] p-4"
              onClick={() => signIn()}
            >
              Se connecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
