import React from 'react'
import {sanityClient, urlFor} from "../sanity";
import {Post} from "../typings";

interface Props {
    posts: [Post];
}
export default function Posts({posts }: Props) {
    console.log(posts);
  return (
    <></>
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