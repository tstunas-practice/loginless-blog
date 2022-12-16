const express = require("express");
const mongoose = require("mongoose");
const hashUtil = require("../utils/hash");
const { Comment } = require("../schemas");
const router = express.Router();
const { ObjectId } = mongoose.mongo;

/**
 * 댓글 목록 조회 API
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
    const result = await Comment.find()
      .where("postId")
      .equals(postId)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 댓글 작성 API
 * - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
 */
router.post("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "postId는 ObjectId여야합니다.",
      });
    }
    const { author, password, content } = req.body;
    let validationError = [];
    if (!author) {
      validationError.push("작성자명은 반드시 입력해야합니다.");
    } else if (author.length > 20) {
      validationError.push("작성자명은 20자 이내로 입력해야합니다.");
    }
    if (!password) {
      validationError.push("비밀번호는 반드시 입력해야합니다.");
    } else if (password.length >= 8) {
      validationError.push("비밀번호는 반드시 8글자 이상으로 입력해야합니다.");
    } else if (!/^[0-9a-zA-Z!@#$%^+\-=]*$/.test(password)) {
      validationError.push(
        "비밀번호는 영문, 숫자, 특수문자(!@#$^+-=만 입력 가능합니다."
      );
    }
    if (!content) {
      validationError.push("글 내용은 반드시 입력해야합니다.");
    } else if (content.length > 100000) {
      validationError.push("글 내용은 10만자를 넘길 수 없습니다.");
    }
    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const passwordHash = await hashUtil.hashPassword(password);
    const comment = new Comment({
      author,
      password: passwordHash,
      content,
      postId,
    });
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "댓글을 작성했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

/**
 * 댓글 수정 API
 * - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
 */
router.put("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "commentId는 ObjectId여야합니다.",
      });
    }
    const { password, content } = req.body;
    let validationError = [];
    if (!password) {
      validationError.push("비밀번호는 반드시 입력해야합니다.");
    } else if (password.length >= 8) {
      validationError.push("비밀번호는 반드시 8글자 이상으로 입력해야합니다.");
    } else if (!/^[0-9a-zA-Z!@#$%^+\-=]*$/.test(password)) {
      validationError.push(
        "비밀번호는 영문, 숫자, 특수문자(!@#$%^+-=만 입력 가능합니다."
      );
    }
    if (!content) {
      validationError.push("글 내용은 반드시 입력해야합니다.");
    } else if (content.length > 100000) {
      validationError.push("글 내용은 10만자를 넘길 수 없습니다.");
    }
    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }
    const comment = await Comment.findById(commentId).lean();
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "해당하는 댓글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, comment.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await Comment.findByIdAndUpdate(commentId, {
      $set: { content: content },
    }).lean();
    return res.status(200).json({
      success: true,
      message: "댓글을 수정했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});
/**
 * 댓글 삭제 API
 * 비밀번호를 넘겨줄 방법이 없어서 post로 대신
 */
router.post("/delete/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "commentId는 ObjectId여야합니다.",
      });
    }
    const { password } = req.body;
    let validationError = [];
    if (!password) {
      validationError.push("비밀번호는 반드시 입력해야합니다.");
    } else if (password.length >= 8) {
      validationError.push("비밀번호는 반드시 8글자 이상으로 입력해야합니다.");
    } else if (!/^[0-9a-zA-Z!@#$%^+\-=]*$/.test(password)) {
      validationError.push(
        "비밀번호는 영문, 숫자, 특수문자(!@#$%^+-=만 입력 가능합니다."
      );
    }
    if (validationError.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }
    const comment = await Comment.findById(commentId).lean();
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "해당하는 댓글이 없습니다.",
      });
    }
    if (!(await hashUtil.comparePassword(password, comment.password))) {
      return res.status(401).json({
        success: false,
        message: "패스워드가 일치하지 않습니다.",
      });
    }
    await Comment.findByIdAndDelete(commentId).lean();
    return res.status(200).json({
      success: true,
      message: "댓글을 삭제했습니다.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, message: "서버에 에러가 발생했습니다." });
  }
});

module.exports = router;
