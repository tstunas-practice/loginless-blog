const express = require("express");
const router = express.Router();

/**
 * 댓글 목록 조회 API
 * - 제목, 작성자명, 작성 내용을 조회하기
 */
router.get("/:postId", (req, res) => {});

/**
 * 댓글 작성 API
 * - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
 */
router.post("/", (req, res) => {});

/**
 * 댓글 수정 API
 * - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
 */
router.put("/:commentId", (req, res) => {});
/**
 * 댓글 삭제 API
 */
router.delete("/:commentId", (req, res) => {});

module.exports = router;