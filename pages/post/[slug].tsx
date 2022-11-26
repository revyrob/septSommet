import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import {useForm, SubmitHandler} from "react-hook-form";

interface Props {
  post: Post;
}

//this shows each post on its own page
function Post({ post }: Props) {
  const {register, handleSubmit, formState: {errors}} = useForm(); 
  //the serializer gives a defination to what the rich text will do when it comes across h1, img, etc
  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url!()}
        alt={post.title}
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url!()}
            alt={post.author.name}
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published on {new Date(post._createdAt).toDateString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => {},
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500"></hr>

      <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10 ">
        <h3 className="text-sm text-yellow-500">Enjoy this article</h3>
        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
        <hr className="py-3 mt-2"></hr>
        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          <input className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring-1" placeholder="Name" type="text" />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring-1" placeholder="Email" type="text" />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring-1" placeholder="Comment" rows={8} />
        </label>
      </form>
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
  const query = `*[_type == "post" && slug.current == $slug][0]{ 
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
    revalidate: 60,
  };
};
