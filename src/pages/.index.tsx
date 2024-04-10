import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

type Props = {
    // Add custom props here
}

const home = function Home(_props: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { t, i18n } = useTranslation(["common"])

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="text-center md:text-left flex flex-col md:flex-row justify-center items-center w-full">
        <Image width="150" height="150" className="rounded-full" src={"/igor.png"} alt="Yeah, that's me."></Image>
        <div className="flex flex-col mt-1 md:mt-0 md:ml-4">
          <p className="text-xl font-black">{t("hello")}</p>
          <p>{t("mymom")}</p>
        </div>
      </div>
      <div className="md:p-5 w-full flex flex-col md:flex-row justify-evenly items-center text-center">
        <button className="mt-1 text-center bg-blue-700 text-blue-200 p-3 rounded-xl" onClick={() => router.push("/about")}>{t("about")}</button>
        {/*<button className="mt-3 text-center bg-green-700 text-green-200 p-3 rounded-xl" >Spotify</button>*/}
      </div>
      <div className="p-4 text-center">
        <p className="text-md">{t("notmuch")}</p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({
    locale,
  }) => ({
    props: {
      ...(await serverSideTranslations(locale ?? 'pt', [
        'common',
      ])),
    },
})

export default home;