import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center w-full h-screen">
        <Image width="100" height="100" className="rounded-full" src={"/igor.png"} alt="Yeah, that's me."></Image>
      </div>
    </>
  );
}
