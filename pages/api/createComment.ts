// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from "@sanity/client"; 

//set it up to talk to sanity
//need sanity token
const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV === 'production',
    //allows us to read and write to our database
    token: process.env.SANITY_API_TOKEN
}

const client = sanityClient(config)

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
    //destructuring these values from the form submission
    const { _id, name, email, comment } = JSON.parse(req.body);

    try{
        await client.create({
            _type:'comment',
            post: {
                _type:'reference',
                _ref: _id,
            },
            name,
            email,
            comment
        });
    }catch (err) {
        return res.status(500).json({message: "Couldn't submit comment", err});
    }
  return res.status(200).json({ message: "Comment submitted"});
}
