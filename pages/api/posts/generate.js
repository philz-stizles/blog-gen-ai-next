import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../../lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  try {
    const { user: currentUser } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("blogGen");

    const user = await db
      .collection("users")
      .findOne({ auth0Id: currentUser.sub });

    if (!user?.availableTokens) {
      return res.status(403).json({
        status: false,
        data: undefined,
        message: "You must have available tokens to access this feature",
      });
    }

    const { topic, keywords } = req.body;

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      // max_tokens: 150,
      temperature: 0.8,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      max_tokens: 3600, // max tokens => 4000
      prompt: reviewPrompt(topic, keywords),
    });

    console.log(completion);

    if (completion.status < 200 || completion.status >= 300) {
      throw new Error(completion.statusText);
    }

    await db.collection("users").updateOne(
      {
        auth0Id: currentUser.sub,
      },
      {
        $inc: {
          availableTokens: -10,
        },
      }
    );

    const parsedResponse = JSON.parse(
      completion.data.choices[0]?.text.split("\n").join("")
    );

    const post = await db.collection("posts").insertOne({
      userId: user._id,
      postContent: parsedResponse?.postContent,
      title: parsedResponse?.title,
      metaDescription: parsedResponse?.metaDescription,
      topic,
      keywords,
      createdAt: new Date(),
    });

    console.log(post);
    res.status(200).json({
      status: true,
      data: post.insertedId,
      message: "post generated successfully",
    });
  } catch (error) {
    console.error(error);
    let message =
      "Failed to generation post. Please try again in a few minutes.";
    if (error && error.message) {
      console.log(`${error.message}`);
      message = error.message;
    }

    res.status(500).json({
      status: false,
      data: undefined,
      message: message,
    });
  }
}

function reviewPrompt(topic, keywords) {
  return `Write a long and detailed SEO-friendly blog post about ${topic}, that target the following comma-separated keywords: ${keywords}.
  The content should be formatted in SEO-friendly HTML.
  The response must also include appropriate HTML title and meta description content.
  The return format must be stringified JSON in the following format:
  {
      "postContent": "post content here"
      "title": "title goes here"
      "metaDescription": "meta description goes here"
  }`;
}
