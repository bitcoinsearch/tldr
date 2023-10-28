import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../config/elasticsearch";
import { buildQuery } from "../../helpers/api-functions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ success: false, message: 'Invalid request method. The endpoint only supports POST requests.' });
  }

  try {
    const {
      queryString,
      size,
      page,
      filterFields,
      sortFields,
      mailListType,
    } = req.body;

    const from = page * size;
    const searchQuery = buildQuery({
      queryString,
      filterFields,
      sortFields,
      from,
      size,
      mailListType,
    });

    const result = await client.search({
      index: process.env.INDEX,
      ...searchQuery,
    });

    return res.status(200).json({
      success: true,
      data: {
        result,
      },
    });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
