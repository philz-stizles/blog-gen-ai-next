import Button from "../ui/Button";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Logo from "../ui/Logo";

const Aside = ({ tokens = 0, posts = [], postId }) => {
  const { user } = useUser();

  return (
    <aside className="flex flex-col text-white overflow-hidden">
      <div className="bg-slate-800 px-2">
        <Logo />
        <Button href="/posts/new" className="btn-primary">
          New Post
        </Button>
        <Link className="block mt-2 text-center" href="/tokens/topup">
          <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
          <span className="pl-1">{tokens} tokens available</span>
        </Link>
      </div>
      <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
        {posts.map((post) => (
          <Link
            href={`/posts/${post._id}`}
            key={post._id}
            className={`${
              postId && postId === post._id ? "bg-white/20 border-white " : ""
            }py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap px-2 my-1 bg-white/10 rounded-sm cursor-pointer`}
          ></Link>
        ))}
      </div>
      <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
        {!!user ? (
          <>
            <div className="min-w-[50px]">
              <Image
                src={user.picture}
                alt={user.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="font-bold">{user.email}</div>
              <Link className="text-sm" href="/api/auth/logout">
                Logout
              </Link>
            </div>
          </>
        ) : (
          <Link href="/api/auth/login">Login</Link>
        )}
      </div>
    </aside>
  );
};

export default Aside;
