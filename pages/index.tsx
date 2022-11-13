import Head from 'next/head'
import Link from 'next/link';
import {sanityClient, urlFor} from "../sanity";
import {Post} from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({posts }: Props) {
 
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='flex justify-between p-5 max-w-7xl mx-auto'>
        <div className="flex items-center space-x-5">
            <Link href="/">
                <img className="w-44  object-contain cursor-pointer" src="https://links.papareact.com/yvf" alt='' />
            </Link>
        
        <div className="hidden md:inline-flex items-center space-x-5">
            <h3>About</h3>
            <h3>Contact</h3>
            <h3 className='text-white bg-green-600 px-4 py-1 rounded-full'>Follow</h3>
        </div>
        </div>
        <div className='flex items-center space-x-5 text-green-600'>
            <h3>Sign-in</h3>
            <h3 className='border px-4 py-1 rounded-full border-green-600'>Get started</h3>
        </div>
    </header>

    <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
    <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif"><span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read, and connect</h1>
    <h2>It's easy and free to post and thinking on any topic and connect with millions of readers.</h2>
    </div>
    <img className="hidden md:inline-flex h-32 lg:h-full" src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt="large M" />
    </div>


    </div>
  )
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
      }
    }
};