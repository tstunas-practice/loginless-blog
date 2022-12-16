const express = require("express");
const mongoose = require("mongoose");
const hashUtil = require("../utils/hash");
const { Post } = require("../schemas");
const router = express.Router();
const { ObjectId } = mongoose.mongo;

/**
 * 게시글 조회 API
 * - 제목, 작성자명, 작성 내용을 조회하기
 */
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "postId는 ObjectId여야합니다.",
      });
    }
    const result = await Post.findById(postId).lean();
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 전체 게시글 목록 조회 API
 * - 제목, 작성자명, 작성 날짜를 조회하기
 * - 작성 날짜를 기준으로 내림차순 정렬하기
 */
router.get("/", async (req, res) => {
  try {
    const result = await Post.find().sort("-createdAt").lean();
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 게시글 작성 API
 * - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
 */
router.post("/", async (req, res) => {
  try {
    const { title, author, password, content } = req.body;
    const passwordHash = await hashUtil.hashPassword(password);
    const post = new Post({
      title: title,
      author: author,
      password: passwordHash,
      content: content,
    });
    await post.save();
    return res.status(200).json({
      success: true,
      message: "게시글을 작성했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 게시글 수정 API
 * - 입력된 비밀번호를 확인하여 수정
 */
router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "postId는 ObjectId여야합니다.",
      });
    }
    const { title, author, password, content } = req.body;
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "비밀번호 입력이 필요합니다.",
      });
    }
    const post = await Post.findById(postId).lean();
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "해당하는 글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, post.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await Post.findByIdAndUpdate(postId, {
      $set: { title: title, author: author, content: content },
    }).lean();
    return res.status(200).json({
      success: true,
      message: "게시글을 업데이트했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 게시글 삭제 API
 * - 입력된 비밀번호를 확인하여 삭제
 */
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "postId는 ObjectId여야합니다.",
      });
    }
    const post = await Post.findById(postId).lean();
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "해당하는 글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, post.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await Post.findByIdAndDelete(postId).lean();
    return res.status(200).json({
      success: true,
      message: "게시글을 삭제했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

module.exports = router;
