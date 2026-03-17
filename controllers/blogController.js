const Blog = require("../models/blogModel");
const { cloudinary } = require("../utils/cloudinary");

// PUBLIC — Get all published posts
exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUBLIC — Get single post by id
exports.getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Get all posts (including drafts)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Create post
exports.createPost = async (req, res) => {
  try {
    const { title, excerpt, content, category, author, published } = req.body;

    const coverImage = req.file ? req.file.path : "";
    const coverImagePublicId = req.file ? req.file.filename : "";

    const post = await Blog.create({
      title,
      excerpt,
      content,
      category,
      author: author || "Admin",
      published: published === "true" || published === true,
      coverImage,
      coverImagePublicId,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { title, excerpt, content, category, author, published } = req.body;

    // If new image uploaded, delete old one from Cloudinary
    if (req.file && post.coverImagePublicId) {
      await cloudinary.uploader.destroy(post.coverImagePublicId);
    }

    const updatedData = {
      title: title ?? post.title,
      excerpt: excerpt ?? post.excerpt,
      content: content ?? post.content,
      category: category ?? post.category,
      author: author ?? post.author,
      published:
        published !== undefined
          ? published === "true" || published === true
          : post.published,
      coverImage: req.file ? req.file.path : post.coverImage,
      coverImagePublicId: req.file
        ? req.file.filename
        : post.coverImagePublicId,
    };

    const updated = await Blog.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Delete image from Cloudinary if exists
    if (post.coverImagePublicId) {
      await cloudinary.uploader.destroy(post.coverImagePublicId);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Toggle publish
exports.togglePublish = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.published = !post.published;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
