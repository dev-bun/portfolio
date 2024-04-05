import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <div className="text-center md:text-left flex flex-col md:flex-row justify-center items-center w-full">
        <Image width="150" height="150" className="rounded-full" src={"/igor.png"} alt="Yeah, that's me."></Image>
        <div className="flex flex-col mt-1 md:mt-0 md:ml-4">
          <p className="text-xl font-black">Hello, i'm Igor</p>
          <p>Yeah, that's me, my mom said that am a beautiful boy.</p>
        </div>
      </div>
      <div className="md:p-5 w-full flex flex-col md:flex-row justify-evenly items-center text-center">
        <button className="mt-1 text-center bg-blue-700 text-blue-200 p-3 rounded-xl">Who I am?</button>
        <button className="mt-3 text-center bg-green-700 text-green-200 p-3 rounded-xl" >Spotify</button>
      </div>
    </div>
  );
}
