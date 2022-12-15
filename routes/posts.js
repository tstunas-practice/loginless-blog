const express = require("express");
const hashUtil = require("../utils/hash");
const { Post } = require("../schemas");
const router = express.Router();

/**
 * 게시글 조회 API
 * - 제목, 작성자명, 작성 내용을 조회하기
 */
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const result = await Post.findById(postId).lean();
  res.json(result);
});

/**
 * 전체 게시글 목록 조회 API
 * - 제목, 작성자명, 작성 날짜를 조회하기
 * - 작성 날짜를 기준으로 내림차순 정렬하기
 */
router.get("/", async (req, res) => {
  const result = await Post.find().sort("-createdAt").lean();
  res.json(result);
});

/**
 * 게시글 작성 API
 * - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
 */
router.post("/", async (req, res) => {
  const { title, author, password, content } = req.body;
  const passwordHash = await hashUtil.hashPassword(password);
  const post = new Post({
    title: title,
    author: author,
    password: passwordHash,
    content: content,
  });
  await post.save();
  res.json({
    message: "성공",
  });
});

/**
 * 게시글 수정 API
 * - 입력된 비밀번호를 확인하여 수정
 */
router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, author, password, content } = req.body;
  if (!password) {
    return res.json({
      message: "비밀번호 필요",
    });
  }
  const post = await Post.findById(postId).lean();
  if (!post) {
    return res.json({
      message: "없음",
    });
  }
  if (!(await hashUtil.comparePassword(password, post.password))) {
    return res.json({
      message: "일치 안함",
    });
  }
  await Post.findByIdAndUpdate(postId, {
    $set: { title: title, author: author, content: content },
  }).lean();
});

/**
 * 게시글 삭제 API
 * - 입력된 비밀번호를 확인하여 삭제
 */
router.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).lean();
  if (!post) {
    return res.json({
      message: "없음",
    });
  }
  if (!(await hashUtil.comparePassword(password, post.password))) {
    return res.json({
      message: "일치 안함",
    });
  }
  await Post.findByIdAndDelete(postId).lean();
  res.json({
    message: "성공",
  });
});

module.exports = router;
