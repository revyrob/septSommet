import { sanityClient, urlFor } from "../../sanity";
import Header from "../../components/Header";
import { Post } from "../../typings";

function Post() {
  return (
    <main>
      <Header />
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
export const getStaticProps: GetStaticProps = async ({params}) => {
   
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
        }`
}