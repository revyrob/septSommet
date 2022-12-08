import Head from "next/head";
import Header from "../components/Header";
import Link from "next/link";
import { sanityClient, urlFor } from "../sanity.js";
import { Post } from "../typings";
import rossland from '../assets/images/rossland.jpg';
import logoRossland from '../assets/images/logoRoss.png';


interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Ecole des Septs-Sommets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="flex justify-around items-center bg-blue-800 border-y border-black py-10 lg:py-0">
        <div className="px-10 space-y-5">
          <h1 className="text-4xl max-w-xl font-sans-serif uppercase p-7 text-white">
            {/* <span className=" decoration-black decoration-4"> */}
            Ecole des Septs-Sommets
            {/* </span>{" "}
            Je apprends en Francais */}
          </h1>
          <h2 className="p-5 text-white">
          Je apprends en Francais
          </h2>
        </div>
        <img
          className="hidden md:flex flex-col h-96 lg:h-96 p-5 border-white py-10 lg:py-0"
          src={rossland.src}
          alt="sept sommet logo rossland"
        />
      </div>

      {/* Posts */}
      <div className="grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts &&
          posts.map((post) => (
            <Link href={`/post/${post.slug.current}`} key={post._id}>
              <div className="border rounded-lg group cursor-pointer overflow-hidden">
                <img
                  className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  src={urlFor(post.mainImage).url()!}
                  alt={post.title}
                />
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt={post.author.name}
                  />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{ 
      _id,
      title,
    author -> {
      name, 
      image
    },
    description,
    mainImage,
    slug
    }`;
  const posts = await sanityClient.fetch(query);

  //works through props to get this info into my component

  return {
    props: {
      posts,
    },
  };
};
