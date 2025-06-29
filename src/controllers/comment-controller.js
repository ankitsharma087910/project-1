import { Article } from "../models/Article.js";

export const getAllCommentsController = async (req, res) => {
  try {
    const articleId = req.params.articleId;

    // Find the article by ID and populate comments
    const article = await Article.findById(articleId).populate({
      path: "comments",
      populate: [
        { path: "user", select: "name email" },
        { path: "replies", populate: { path: "user", select: "name email" } },
      ],
    });

    if (!article) {
      return responseHandler(res, 404, null, "Article not found");
    }

    if (!article.comments || article.comments.length === 0) {
      return responseHandler(
        res,
        404,
        null,
        "No comments found for this article"
      );
    }

    return responseHandler(
      res,
      200,
      article.comments,
      "Comments fetched successfully"
    );
  } catch (err) {
    console.log(err, "error fetching comments");
    return responseHandler(res, 500, null, "Internal Server Error");
  }
};

export const addCommentController = async (req, res) => {
  try {
    const articleId = req.params.id;
    const { comment } = req.body;

    // Validate input
    if (!comment) {
      return responseHandler(res, 400, null, "Comment is required");
    }

    // Find the article by ID
    const article = await Article.findById(articleId);
    if (!article) {
      return responseHandler(res, 404, null, "Article not found");
    }

    // Add the comment to the article's comments array
    article.comments.push({
      user: req.user._id,
      comment,
      createdAt: new Date(),
    });

    // Save the updated article
    await article.save();

    return responseHandler(res, 200, null, "Comment added successfully");
  } catch (err) {
    console.log(err, "error adding comment");
    return responseHandler(res, 500, null, "Internal Server Error");
  }
};

export const addReplyController = async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!comment) {
      return responseHandler(res, 400, null, "Reply content is required");
    }

    // Find the article
    const article = await Article.findById(articleId);
    if (!article) {
      return responseHandler(res, 404, null, "Article not found");
    }

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return responseHandler(res, 404, null, "Parent comment not found");
    }

    // Create a new reply comment
    const newReply = new Comment({
      comment,
      user: userId,
      createdAt: new Date(),
    });

    // Save the reply
    await newReply.save();

    // Add the reply to the parent comment's replies array
    parentComment.replies.push(newReply._id);
    await parentComment.save();

    return responseHandler(res, 200, null, "Reply added successfully");
  } catch (err) {
    console.log(err, "error adding reply");
    return responseHandler(res, conquista, null, "Internal Server Error");
  }
};