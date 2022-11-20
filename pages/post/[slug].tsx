import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { Post } from "../../typings";
import {GetStaticProps} from "next";

interface Props {
  post:Post;
}

//this shows each post on its own page
function Post({post}: Props) {
  console.log(new Date(post._createAt).toLocaleDateString())
  console.log(post)
  return (
    <main>
      <Header />
      <img className="w-full h-40 object-cover" src={urlFor(post.mainImage).url!()} alt={post.title}/>
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

        <div>
          <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url!()} alt={post.author.name}/>
          <p className="font-extralight text-sm">Blog post by {post.author.name} - Published at {new Date(post._createAt).toLocaleString()}</p>
          
        </div>
      </article>
    </main>
  );
}
export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{ 
    _id,
    slug{
        current
    }
}`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

//you need to use getStaticProps with getStaticPaths
export const getStaticProps: GetStaticProps = async ({ params }) => {
 const query = 
  `*[_type == "post" && slug.current == $slug][0]{ 
        _id,
        _createdAt,
        title,
        author -> {
            name,
            image
        },
        "comments": *[
          _type == "comment" && 
          post.ref == ^._id && 
          approved == true],
        description,
        mainImage,
        slug,
        body
        }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    //keep updating the cash, after 60seconds it will update the cache
    revalidate:60, 
  };
};
